//
//  LndReactModule.m
//  lightning
//
//  Created by Johan Torås Halseth on 05/11/2018.
//

#import "LndReactModule.h"
#import <React/RCTLog.h>
#import <React/RCTConvert.h>
#import <Lndmobile/Lndmobile.h>

static NSString* const streamEventName = @"streamEvent";
static NSString* const streamIdKey = @"streamId";
static NSString* const respB64Key = @"b64";
static NSString* const respErrorKey = @"error";

@interface NativeCallback:NSObject<LndmobileCallback>
@property (nonatomic) RCTPromiseResolveBlock resolve;
@property (nonatomic) RCTPromiseRejectBlock reject;

@end

@implementation NativeCallback

- (instancetype)initWithResolver: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject
{
    self = [super init];
    if (self) {
        self.resolve = resolve;
        self.reject = reject;
    }
    return self;
}

- (void)onError:(NSError *)p0 {
    NSLog(@"Got error %@", p0);
    self.reject(@"error", @"received error", p0);
}

- (void)onResponse:(NSData *)p0 {
    NSLog(@"Go response %@", p0);
    NSString* b64 = [p0 base64EncodedStringWithOptions:0];
    NSLog(@"Go response string %@", b64);
    self.resolve(@{@"b64": b64});
}

@end

@interface RecvStream:NSObject<LndmobileCallback>
@property (nonatomic) NSString* streamId;
@property (nonatomic) RCTEventEmitter* eventEmitter;

@end

@implementation RecvStream

- (instancetype)initWithStreamId: (NSString*)streamId emitter: (RCTEventEmitter*)e
{
    self = [super init];
    if (self) {
        self.streamId = streamId;
        self.eventEmitter = e;
    }
    return self;
}

- (void)onError:(NSError *)p0 {
    NSLog(@"Go error %@", p0);
    [self.eventEmitter sendEventWithName:streamEventName body:@{streamIdKey: self.streamId, respErrorKey: [p0 localizedDescription]}];
}

- (void)onResponse:(NSData *)p0 {
    NSLog(@"Go response %@", p0);
    NSString* b64 = [p0 base64EncodedStringWithOptions:0];
    NSLog(@"Go response string %@", b64);
    [self.eventEmitter sendEventWithName:streamEventName body:@{streamIdKey: self.streamId, respB64Key: b64}];
}

@end

@implementation LndReactModule

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
    return @[streamEventName];
}


typedef void (^SyncHandler)(NSData*, NativeCallback*);
typedef id<LndmobileSendStream> (^StreamHandler)(NSData* req, RecvStream* respStream, NSError** err);

RCT_EXPORT_METHOD(start: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{

    self.syncMethods = @{
                         @"GetInfo" : ^(NSData* bytes, NativeCallback* cb) { LndmobileGetInfo(bytes, cb); },
                         };

    self.streamMethods = @{
                           @"SendPayment" : (id<LndmobileSendStream>)^(NSData* req, RecvStream* cb, NSError** err) { return LndmobileSendPayment(cb, err); },
                           @"CloseChannel" : (id<LndmobileSendStream>)^(NSData* req, RecvStream* cb, NSError** err) { return LndmobileCloseChannel(req, cb); },
                           };

    self.activeStreams = [NSMutableDictionary dictionary];

    NSFileManager *fileMgr = [NSFileManager defaultManager];
    NSURL *dir = [[fileMgr URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] lastObject];

    NSString *lndConf = [[NSBundle mainBundle] pathForResource:@"lnd" ofType:@"conf"];
    NSString *confTarget = [dir.path stringByAppendingString:@"/lnd.conf"];

    [fileMgr removeItemAtPath:confTarget error:nil];
    [fileMgr copyItemAtPath:lndConf toPath: confTarget error:nil];

    RCTLogInfo(@"lnd dir: %@", dir.path);

    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        RCTLogInfo(@"Starting lnd");
        NativeCallback* cb = [[NativeCallback alloc] initWithResolver:resolve rejecter:reject];
        LndmobileStart(dir.path, cb);
    });

}

RCT_EXPORT_METHOD(sendCommand:(NSString*)method body:(NSString*)msg
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{

    SyncHandler block = [self.syncMethods objectForKey:method];
    if (block == nil) {
        NSLog(@"method %@ not found", method);
        NSError* err = [[NSError alloc] initWithDomain:@"LND" code:0 userInfo: @{ NSLocalizedDescriptionKey: NSLocalizedString(@"Method not found.", nil) }];
        reject(@"error", @"method not found", err);
        return;
    }

    NSData* bytes = [[NSData alloc]initWithBase64EncodedString:msg options:0];
    block(bytes, [[NativeCallback alloc] initWithResolver:resolve rejecter:reject]);
}

RCT_EXPORT_METHOD(sendStreamCommand:(NSString*)method streamId:(NSString*)streamId body:(NSString*)msg)
{

    RecvStream* respStream = [[RecvStream alloc] initWithStreamId:streamId emitter:self];
    StreamHandler block = self.streamMethods[method];
    if (block == nil) {
        NSLog(@"method %@ not found", method);
        NSError* err = [[NSError alloc] initWithDomain:@"LND" code:0 userInfo: @{ NSLocalizedDescriptionKey: NSLocalizedString(@"Method not found.", nil) }];
        [respStream onError:err];
        return;
    }

    NSData* bytes = [[NSData alloc]initWithBase64EncodedString:msg options:0];
    NSError* err = nil;
    id<LndmobileSendStream> sendStream = block(bytes, respStream, &err);
    if (err != nil) {
        NSLog(@"got init error %@", err);
        [respStream onError:err];
        return;
    }

    if (sendStream == nil) {
        return;
    }

    self.activeStreams[streamId] = sendStream;
}

@end
