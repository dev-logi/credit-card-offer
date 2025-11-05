// Navigation Type Definitions

import { NavigatorScreenParams } from '@react-navigation/native';

// Root Stack Navigator Params
export type RootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  SelectCards: {
    customerId: string;
    isFirstTime: boolean;
  };
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
};

// Main Tabs Navigator Params
export type MainTabsParamList = {
  FindCard: undefined;
  MyCards: undefined;
  Profile: undefined;
};

// Screen Props Types
export type WelcomeScreenProps = {
  navigation: any; // Will be typed with NativeStackNavigationProp
};

export type RegisterScreenProps = {
  navigation: any;
};

export type SelectCardsScreenProps = {
  navigation: any;
  route: {
    params: {
      customerId: string;
      isFirstTime: boolean;
    };
  };
};

export type RecommendScreenProps = {
  navigation: any;
};

export type MyCardsScreenProps = {
  navigation: any;
};

export type ProfileScreenProps = {
  navigation: any;
};

