// Import all icons
import beerIcon from '../Icons/beer.svg';
import cocktailIcon from '../Icons/cocktail.svg';
import coffeeIcon from '../Icons/coffee.svg';
import juicesIcon from '../Icons/juices.svg';
import mocktailsIcon from '../Icons/mocktails.svg';
import softdrinksIcon from '../Icons/softdrinks.svg';
import spiritsIcon from '../Icons/spirits.svg';
import sportdrinksIcon from '../Icons/sportdrinks.svg';
import teaIcon from '../Icons/tea.svg';
import wineIcon from '../Icons/wine.svg';

import locallyProducedIcon from '../Icons/locallyproduced.svg';
import madeInBelgiumIcon from '../Icons/madeinbelgium.svg';
import globallySourcedIcon from '../Icons/globallysourced.svg';

import summerIcon from '../Icons/summer.svg';
import winterIcon from '../Icons/winter.svg';
import autumnIcon from '../Icons/autumn.svg';
import springIcon from '../Icons/spring.svg';

import highMarginIcon from '../Icons/highmargin.svg';
import hotForYouIcon from '../Icons/hotforyou.svg';
import trendingIcon from '../Icons/trending.svg';
import ecoFriendlyIcon from '../Icons/ecofriendly.svg';

// Drinks / Segments
export const segmentOptions = [
    { id: 'beer', label: 'Beer', checked: true, icon: beerIcon },
    { id: 'cocktail', label: 'Cocktail', checked: true, icon: cocktailIcon },
    { id: 'coffee', label: 'Coffee', checked: true, icon: coffeeIcon },
    { id: 'juices', label: 'Juices', checked: true, icon: juicesIcon },
    { id: 'mocktails', label: 'Mocktails', checked: true, icon: mocktailsIcon },
    { id: 'soft drinks', label: 'Soft Drinks', checked: true, icon: softdrinksIcon },
    { id: 'spirits', label: 'Spirits', checked: true, icon: spiritsIcon },
    { id: 'sport/energy drinks', label: 'Sport/Energy Drinks', checked: true, icon: sportdrinksIcon },
    { id: 'tea & infusions', label: 'Tea & Infusions', checked: true, icon: teaIcon },
    { id: 'wine', label: 'Wine', checked: true, icon: wineIcon },
];

// Production origin
export const locationOptions = [
    { id: 'locally-produced', label: 'Locally Produced', checked: true, icon: locallyProducedIcon },
    { id: 'made-in-belgium', label: 'Made in Belgium', checked: true, icon: madeInBelgiumIcon },
    { id: 'globally-sourced', label: 'Globally Sourced', checked: true, icon: globallySourcedIcon },
];

// Seasons
export const seasonOptions = [
    { id: 'summer', label: 'Summer', checked: true, icon: summerIcon },
    { id: 'winter', label: 'Winter', checked: true, icon: winterIcon },
    { id: 'autumn', label: 'Autumn', checked: true, icon: autumnIcon },
    { id: 'spring', label: 'Spring', checked: true, icon: springIcon },
];

// Highlights (special characteristics)
export const highlightOptions = [
    { id: 'high-margin', label: 'High Margin', checked: true, icon: highMarginIcon },
    { id: 'hot-for-you', label: 'Hot for You', checked: true, icon: hotForYouIcon },
    { id: 'trending', label: 'Trending', checked: true, icon: trendingIcon },
    { id: 'eco-friendly', label: 'Eco-Friendly', checked: true, icon: ecoFriendlyIcon },
];
