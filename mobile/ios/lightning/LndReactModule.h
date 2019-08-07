//
//  LndReactModule.h
//  lightning
//
//  Created by Johan Torås Halseth on 05/11/2018.
//


#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface LndReactModule : RCTEventEmitter <RCTBridgeModule>
@property (nonatomic) NSDictionary *syncMethods;
@property (nonatomic) NSDictionary *recvStreamMethods;
@property (nonatomic) NSDictionary *biStreamMethods;
@property (nonatomic) NSMutableDictionary *activeStreams;
@property (nonatomic) NSString *appDir;

@end
