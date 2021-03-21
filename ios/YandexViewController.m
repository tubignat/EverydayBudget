//
//  EDBYandexViewController.m
//  EverydayBudget
//
//  Created by Ignat.Tubylov on 21.03.2021.
//

#import <Foundation/Foundation.h>
#import <YandexMobileAds/YandexMobileAds.h>
#import "YandexViewController.h"

@implementation YandexViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    YMAAdSize *adSize = [YMAAdSize flexibleSizeWithContainerWidth:CGRectGetWidth(self.view.frame)];
    self.adView = [[YMAAdView alloc] initWithBlockID:self.blockId adSize:adSize];
    self.adView.delegate = self;
  
    [self.view addSubview:self.adView];

    [self.adView setTranslatesAutoresizingMaskIntoConstraints:NO];
     NSLayoutConstraint *centerHorizontally =
        [NSLayoutConstraint constraintWithItem:self.adView
                                     attribute:NSLayoutAttributeLeft
                                     relatedBy:NSLayoutRelationEqual
                                        toItem:self.view
                                     attribute:NSLayoutAttributeLeft
                                    multiplier:1.f
                                      constant:0.f];
    NSLayoutConstraint *centerVertically =
        [NSLayoutConstraint constraintWithItem:self.adView
                                     attribute:NSLayoutAttributeTop
                                     relatedBy:NSLayoutRelationEqual
                                        toItem:self.view
                                     attribute:NSLayoutAttributeTop
                                    multiplier:1.f
                                      constant:0.f];

    [self.view addConstraint:centerVertically];
    [self.view addConstraint:centerHorizontally];
  
    [self.adView loadAd];
}

#pragma mark - YMAAdViewDelegate

// Uncomment to open web links in in-app browser

//- (UIViewController *)viewControllerForPresentingModalView
//{
//    return self;
//}

- (void)adViewDidLoad:(YMAAdView *)adView
{
    NSLog(@"Ad loaded");
}

- (void)adViewDidFailLoading:(YMAAdView *)adView error:(NSError *)error
{
    NSLog(@"Ad failed loading. Error: %@", error);
}

- (void)adViewWillLeaveApplication:(YMAAdView *)adView
{
    NSLog(@"Ad will leave application");
}

- (void)adView:(YMAAdView *)adView willPresentScreen:(UIViewController *)viewController
{
    NSLog(@"Ad will present screen");
}

-(void)adView:(YMAAdView *)adView didDismissScreen:(UIViewController *)viewController
{
    NSLog(@"Ad did dismiss screen");
}

@end
