//
//  EVBCalendarModule.m
//  EverydayBudget
//
//  Created by Ignat.Tubylov on 21.03.2021.
//

#import <Foundation/Foundation.h>
#import <React/RCTViewManager.h>
#import "YandexViewController.h"


@interface EDBYandexAdBigBannerManager : RCTViewManager
@end

@implementation EDBYandexAdBigBannerManager

RCT_EXPORT_MODULE(EDBYandexAdBannerBig)

- (UIView *)view
{
  YandexViewController* tmp = [[YandexViewController alloc] init];
  tmp.blockId = @"R-M-DEMO-300x250-context";
  return tmp.view;
}

@end
