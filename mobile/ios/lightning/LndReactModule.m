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

@interface NativeCallback:NSObject<LndmobileCallback>
@property (nonatomic) RCTResponseSenderBlock jsCallback;

@end

@implementation NativeCallback

- (instancetype)initWithCallback: (RCTResponseSenderBlock)c
{
    self = [super init];
    if (self) {
        self.jsCallback = c;
    }
    return self;
}

- (void)onError:(NSError *)p0 {
    NSLog(@"Got error %@", p0);
    self.jsCallback(@[p0]);
}

- (void)onResponse:(NSData *)p0 {
    NSLog(@"Go response %@", p0);
    NSString* b64 = [p0 base64EncodedStringWithOptions:0];
    self.jsCallback(@[[NSNull null], b64]);
}

@end

@interface StreamEvents:NSObject<LndmobileCallback>
@property (nonatomic) NSString* name;
@property (nonatomic) RCTEventEmitter* eventEmitter;

@end

@implementation StreamEvents

- (instancetype)initWithName: (NSString*)c emitter: (RCTEventEmitter*)e
{
    self = [super init];
    if (self) {
        self.name = c;
        self.eventEmitter = e;
    }
    return self;
}

- (void)onError:(NSError *)p0 {
    NSLog(@"Go error %@", p0);
    [self.eventEmitter sendEventWithName:self.name body:@{@"error": [p0 localizedDescription]}];
}

- (void)onResponse:(NSData *)p0 {
    NSLog(@"Go response %@", p0);
    NSString* b64 = [p0 base64EncodedStringWithOptions:0];
    [self.eventEmitter sendEventWithName:self.name body:@{@"resp": b64}];
}

@end

@implementation LndReactModule

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"SendResponse"];
}

RCT_EXPORT_METHOD(Start:(RCTResponseSenderBlock)callback)
{
    NSFileManager *fileMgr = [NSFileManager defaultManager];
    NSURL *dir = [[fileMgr URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] lastObject];

    NSString *lndConf = [[NSBundle mainBundle] pathForResource:@"lnd" ofType:@"conf"];
    NSString *confTarget = [dir.path stringByAppendingString:@"/lnd.conf"];

    [fileMgr removeItemAtPath:confTarget error:nil];
    [fileMgr copyItemAtPath:lndConf toPath: confTarget error:nil];

    RCTLogInfo(@"lnd dir: %@", dir.path);

    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        RCTLogInfo(@"Starting lnd");
        NativeCallback* cb = [[NativeCallback alloc] initWithCallback:callback];
        LndmobileStart(dir.path, cb);
    });

}

RCT_EXPORT_METHOD(GetInfo:(NSString*)msg callback:(RCTResponseSenderBlock)callback)
{
    RCTLogInfo(@"Getting info from string %@", msg);

    NSData* bytes = [[NSData alloc]initWithBase64EncodedString:msg options:0];
    LndmobileGetInfo(bytes, [[NativeCallback alloc] initWithCallback:callback]);
}

RCT_EXPORT_METHOD(SendPayment:(NSString*)msg)
{
    NSData* bytes = [[NSData alloc]initWithBase64EncodedString:msg options:0];
    StreamEvents* respStream = [[StreamEvents alloc] initWithName:@"SendResponse" emitter:self];
    NSError* err = nil;
    id<LndmobileSendStream> stream = LndmobileSendPayment(respStream, &err);
    if (err != nil) {
        NSLog(@"got init error %@", err);
        [respStream onError:err];
        return;
    }

    NSLog(@"stream %@", stream);

    [stream send:bytes error:&err];
    if (err != nil) {
        NSLog(@"got stream error %@", err);
        [respStream onError:err];
        return;
    }
}

@end
