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
static NSString* const respB64DataKey = @"data";
static NSString* const respErrorKey = @"error";
static NSString* const respEventTypeKey = @"event";
static NSString* const respEventTypeData = @"data";
static NSString* const respEventTypeError = @"error";
static NSString* const logEventName = @"logs";

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
    self.reject(@"error", [p0 localizedDescription], p0);
}

- (void)onResponse:(NSData *)p0 {
    NSString* b64 = [p0 base64EncodedStringWithOptions:0];
    if (b64 == nil) {
        b64 = @"";
    }
    self.resolve(@{respB64DataKey: b64});
}

@end

@interface RecvStream:NSObject<LndmobileRecvStream>
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
    [self.eventEmitter sendEventWithName:streamEventName
                                    body:@{
                                           streamIdKey: self.streamId,
                                           respEventTypeKey: respEventTypeError,
                                           respErrorKey: [p0 localizedDescription],
                                           }
     ];
}

- (void)onResponse:(NSData *)p0 {
    NSString* b64 = [p0 base64EncodedStringWithOptions:0];
    if (b64 == nil) {
        b64 = @"";
    }
    [self.eventEmitter sendEventWithName:streamEventName
                                    body:@{
                                           streamIdKey: self.streamId,
                                           respEventTypeKey: respEventTypeData,
                                           respB64DataKey: b64,
                                           }
     ];
}

@end

@implementation LndReactModule

RCT_EXPORT_MODULE();

- (NSArray<NSString *> *)supportedEvents
{
    return @[streamEventName, logEventName];
}


typedef void (^SyncHandler)(NSData*, NativeCallback*);
typedef void (^RecvStreamHandler)(NSData* req, RecvStream* respStream);
typedef id<LndmobileSendStream> (^BiStreamHandler)(NSData* req, RecvStream* respStream, NSError** err);

RCT_EXPORT_METHOD(start: (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    // Avoid crash on socket close.
    signal(SIGPIPE, SIG_IGN);

    self.syncMethods = @{
                         @"GetInfo" : ^(NSData* bytes, NativeCallback* cb) { LndmobileGetInfo(bytes, cb); },
                         @"ListChannels" : ^(NSData* bytes, NativeCallback* cb) { LndmobileListChannels(bytes, cb); },
                         @"PendingChannels" : ^(NSData* bytes, NativeCallback* cb) { LndmobilePendingChannels(bytes, cb); },
                         @"ClosedChannels" : ^(NSData* bytes, NativeCallback* cb) { LndmobileClosedChannels(bytes, cb); },
                         @"ListPeers" : ^(NSData* bytes, NativeCallback* cb) { LndmobileListPeers(bytes, cb); },
                         @"ConnectPeer" : ^(NSData* bytes, NativeCallback* cb) { LndmobileConnectPeer(bytes, cb); },
                         @"AddInvoice" : ^(NSData* bytes, NativeCallback* cb) { LndmobileAddInvoice(bytes, cb); },
                         @"DecodePayReq" : ^(NSData* bytes, NativeCallback* cb) { LndmobileDecodePayReq(bytes, cb); },
                         @"QueryRoutes" : ^(NSData* bytes, NativeCallback* cb) { LndmobileQueryRoutes(bytes, cb); },
                         @"SendCoins" : ^(NSData* bytes, NativeCallback* cb) { LndmobileSendCoins(bytes, cb); },
                         @"GetTransactions" : ^(NSData* bytes, NativeCallback* cb) { LndmobileGetTransactions(bytes, cb); },
                         @"ListInvoices" : ^(NSData* bytes, NativeCallback* cb) { LndmobileListInvoices(bytes, cb); },
                         @"ListPayments" : ^(NSData* bytes, NativeCallback* cb) { LndmobileListPayments(bytes, cb); },
                         @"GenSeed" : ^(NSData* bytes, NativeCallback* cb) { LndmobileGenSeed(bytes, cb); },
                         @"InitWallet" : ^(NSData* bytes, NativeCallback* cb) { LndmobileInitWallet(bytes, cb); },
                         @"ChangePassword" : ^(NSData* bytes, NativeCallback* cb) { LndmobileChangePassword(bytes, cb); },
                         @"UnlockWallet" : ^(NSData* bytes, NativeCallback* cb) { LndmobileUnlockWallet(bytes, cb); },
                         @"WalletBalance" : ^(NSData* bytes, NativeCallback* cb) { LndmobileWalletBalance(bytes, cb); },
                         @"ChannelBalance" : ^(NSData* bytes, NativeCallback* cb) { LndmobileChannelBalance(bytes, cb); },
                         @"NewAddress" : ^(NSData* bytes, NativeCallback* cb) { LndmobileNewAddress(bytes, cb); },
                         @"EstimateFee" : ^(NSData* bytes, NativeCallback* cb) { LndmobileEstimateFee(bytes, cb); },
                         @"StopDaemon" : ^(NSData* bytes, NativeCallback* cb) { LndmobileStopDaemon(bytes, cb); },
                         @"Status" : ^(NSData* bytes, NativeCallback* cb) { LndmobileStatus(bytes, cb); },
                         @"SetScores" : ^(NSData* bytes, NativeCallback* cb) { LndmobileSetScores(bytes, cb); },
                         @"QueryScores" : ^(NSData* bytes, NativeCallback* cb) { LndmobileQueryScores(bytes, cb); },
                         @"ModifyStatus" : ^(NSData* bytes, NativeCallback* cb) { LndmobileModifyStatus(bytes, cb); },
                         };

    self.recvStreamMethods = @{
                           @"CloseChannel" : ^(NSData* req, RecvStream* cb) { return LndmobileCloseChannel(req, cb); },
                           @"OpenChannel" : ^(NSData* req, RecvStream* cb) { return LndmobileOpenChannel(req, cb); },
                           @"SubscribeTransactions" : ^(NSData* req, RecvStream* cb) { return LndmobileSubscribeTransactions(req, cb); },
                           @"SubscribeInvoices" : ^(NSData* req, RecvStream* cb) { return LndmobileSubscribeInvoices(req, cb); },
                           @"SubscribeChannelBackups" : ^(NSData* req, RecvStream* cb) { return LndmobileSubscribeChannelBackups(req, cb); },
                           };

  self.biStreamMethods = @{
                             @"SendPayment" : (id<LndmobileSendStream>)^(NSData* req, RecvStream* cb, NSError** err) { return LndmobileSendPayment(cb, err); },
                             };

    self.activeStreams = [NSMutableDictionary dictionary];

    NSFileManager *fileMgr = [NSFileManager defaultManager];
    NSURL *dir = [[fileMgr URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] lastObject];

    self.appDir = dir.path;
    RCTLogInfo(@"lnd dir: %@", self.appDir);

    NSString *lndConf = [[NSBundle mainBundle] pathForResource:@"lnd" ofType:@"conf"];
    NSString *confTarget = [self.appDir stringByAppendingString:@"/lnd.conf"];

    [fileMgr removeItemAtPath:confTarget error:nil];
    [fileMgr copyItemAtPath:lndConf toPath: confTarget error:nil];

    NSString *logFile = [self.appDir stringByAppendingString:@"/logs/bitcoin/testnet/lnd.log"];
    NSFileHandle *fileHandle = [NSFileHandle fileHandleForReadingAtPath:logFile];

    dispatch_async(dispatch_get_main_queue(), ^{
        [[NSNotificationCenter defaultCenter] addObserverForName:NSFileHandleReadCompletionNotification
                                                          object:fileHandle
                                                           queue:[NSOperationQueue mainQueue]
                                                      usingBlock:^(NSNotification *n) {
                                                          NSData *data = [n.userInfo objectForKey:NSFileHandleNotificationDataItem];
                                                          if (data != nil && [data length] > 0) {
                                                              NSString *s = [[NSString alloc]initWithBytes:[data bytes] length:[data length] encoding:NSUTF8StringEncoding];
                                                              if (s != nil) {
                                                                  [self sendEventWithName:logEventName body:s];
                                                              }
                                                          }
                                                          [fileHandle readInBackgroundAndNotify];
                                                      }];
        [fileHandle seekToEndOfFile];
        [fileHandle readInBackgroundAndNotify];
    });

    NSString *args = [NSString stringWithFormat:@"--lnddir=%@", self.appDir];

    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^(void){
        RCTLogInfo(@"Starting lnd");
        NativeCallback* cb = [[NativeCallback alloc] initWithResolver:resolve rejecter:reject];
        LndmobileStart(args, cb);
    });

}

RCT_EXPORT_METHOD(sendCommand:(NSString*)method body:(NSString*)msg
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
    SyncHandler block = [self.syncMethods objectForKey:method];
    if (block == nil) {
        RCTLogError(@"method %@ not found", method);
        return;
    }

    NSData* bytes = [[NSData alloc]initWithBase64EncodedString:msg options:0];
    block(bytes, [[NativeCallback alloc] initWithResolver:resolve rejecter:reject]);
}

RCT_EXPORT_METHOD(sendStreamCommand:(NSString*)method streamId:(NSString*)streamId body:(NSString*)msg)
{
    RecvStream* respStream = [[RecvStream alloc] initWithStreamId:streamId emitter:self];
    NSData* bytes = [[NSData alloc]initWithBase64EncodedString:msg options:0];

    // Check if the method is among the receive-only stream methods.
    RecvStreamHandler recvStr = self.recvStreamMethods[method];
    if (recvStr != nil) {
        recvStr(bytes, respStream);
        return;
    }

    // Otherwise check whether this method has a bidirectional stream.
    BiStreamHandler biStr = self.biStreamMethods[method];
    if (biStr != nil) {
        NSError *err = nil;
        id<LndmobileSendStream> sendStream = biStr(bytes, respStream, &err);
        if (err != nil) {
            RCTLogError(@"got init error %@", err);
            return;
        }

        // This method must have a non-nil send stream.
        if (sendStream == nil) {
            RCTLogError(@"Got nil send stream for method %@", method);
            return;
        }

        // TODO: clean up on stream close.
        self.activeStreams[streamId] = sendStream;
        return;
    }

    RCTLogError(@"Stream method %@ not found", method);
    return;
}

RCT_EXPORT_METHOD(sendStreamWrite:(NSString*)streamId body:(NSString*)msg)
{
    // TODO: clean up on stream close.
    id<LndmobileSendStream> sendStream = self.activeStreams[streamId];
    if (sendStream == nil) {
        RCTLogError(@"StreamId %@ not found", streamId);
        return;
    }

    NSData* bytes = [[NSData alloc]initWithBase64EncodedString:msg options:0];

    NSError* err = nil;
    [sendStream send:bytes error:&err];
    if (err != nil) {
        NSLog(@"send stream error %@", err);
        return;
    }
}

@end
