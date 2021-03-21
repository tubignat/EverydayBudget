//
//  EVBCalendarModule.m
//  EverydayBudget
//
//  Created by Ignat.Tubylov on 21.03.2021.
//

#import <Foundation/Foundation.h>
#import <React/RCTViewManager.h>
#import "YandexViewController.h"


@interface EDBYandexAdBannerManager : RCTViewManager
@end

@implementation EDBYandexAdBannerManager

RCT_EXPORT_MODULE(EDBYandexAdBanner)

- (UIView *)view
{
  YandexViewController* tmp = [[YandexViewController alloc] init];
  tmp.blockId = @"R-M-DEMO-320x50";
  return tmp.view;
}

@end
