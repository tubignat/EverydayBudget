//
//  YandexViewController.h
//  EverydayBudget
//
//  Created by Ignat.Tubylov on 21.03.2021.
//

#ifndef YandexViewController_h
#define YandexViewController_h

#import <YandexMobileAds/YandexMobileAds.h>

@interface YandexViewController : UIViewController
@end


@interface YandexViewController () <YMAAdViewDelegate>

@property (nonatomic, strong) YMAAdView *adView;
@property (nonatomic, strong) NSString *blockId;

@end
#endif /* YandexViewController_h */
