// ===== ToAdd.js =====
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TopWorstSellers.css';
import './ToAdd.css'
import Optionbar from './Optionbar';

// Import category icons
import beerIcon from './Icons/beer.svg';
import cocktailIcon from './Icons/cocktail.svg';
import coffeeIcon from './Icons/coffee.svg';
import juicesIcon from './Icons/juices.svg';
import mocktailsIcon from './Icons/mocktails.svg';
import softdrinksIcon from './Icons/softdrinks.svg';
import spiritsIcon from './Icons/spirits.svg';
import sportdrinksIcon from './Icons/sportdrinks.svg';
import teaIcon from './Icons/tea.svg';
import wineIcon from './Icons/wine.svg';

import beerMissing   from './Icons/beer_missing.svg';
import beerExtra     from './Icons/beer_extra.svg';
import cocktailMissing from './Icons/cocktail_missing.svg';
import cocktailExtra   from './Icons/cocktail_extra.svg';
import coffeeMissing   from './Icons/coffee_missing.svg';
import coffeeExtra     from './Icons/coffee_extra.svg';
import juicesMissing   from './Icons/juice_missing.svg';
import juicesExtra     from './Icons/juice_extra.svg';
import mocktailsMissing from './Icons/mocktails_missing.svg';
import mocktailsExtra   from './Icons/mocktails_extra.svg';
import softdrinksMissing from './Icons/softdrinks_missing.svg';
import softdrinksExtra   from './Icons/softdrinks_extra.svg';
import spiritsMissing    from './Icons/spirits_missing.svg';
import spiritsExtra      from './Icons/spirits_extra.svg';
import sportdrinksMissing from './Icons/sportdrinks_missing.svg';
import sportdrinksExtra   from './Icons/sportdrinks_extra.svg';
import teaMissing         from './Icons/tea-bag_missing.svg';
import teaExtra           from './Icons/tea-bag_extra.svg';
import wineMissing        from './Icons/wine_missing.svg';
import wineExtra          from './Icons/wine_extra.svg';

// Import highlight & other icons
import highMarginIcon from './Icons/highmargin.svg';
import trendingIcon from './Icons/trending.svg';
import ecoIcon from './Icons/ecofriendly.svg';
import summerIcon from './Icons/summer.svg';
import winterIcon from './Icons/winter.svg';
import autumnIcon from './Icons/autumn.svg';
import springIcon from './Icons/spring.svg';
import locallyIcon from './Icons/locallyproduced.svg';
import belgiumIcon from './Icons/madeinbelgium.svg';
import globalIcon from './Icons/globallysourced.svg';
import hotForYouIcon from './Icons/hotforyou.svg';

import { highlightOptions, locationOptions, seasonOptions, segmentOptions } from './Icons/optionbarOptions';

const categoryIconMap = {
    Beer: beerIcon,
    Cocktail: cocktailIcon,
    Coffee: coffeeIcon,
    Juices: juicesIcon,
    Mocktails: mocktailsIcon,
    'Soft Drinks': softdrinksIcon,
    Spirits: spiritsIcon,
    'Sport/Energy Drinks': sportdrinksIcon,
    'Tea & Infusions': teaIcon,
    Wine: wineIcon,
};

const missingIconMap = {
    Beer:              beerMissing,
    Cocktail:          cocktailMissing,
    Coffee:            coffeeMissing,
    Juices:            juicesMissing,
    Mocktails:         mocktailsMissing,
    'Soft Drinks':     softdrinksMissing,
    Spirits:           spiritsMissing,
    'Sport/Energy Drinks': sportdrinksMissing,
    'Tea & Infusions': teaMissing,
    Wine:              wineMissing
};

const extraIconMap = {
    Beer:              beerExtra,
    Cocktail:          cocktailExtra,
    Coffee:            coffeeExtra,
    Juices:            juicesExtra,
    Mocktails:         mocktailsExtra,
    'Soft Drinks':     softdrinksExtra,
    Spirits:           spiritsExtra,
    'Sport/Energy Drinks': sportdrinksExtra,
    'Tea & Infusions': teaExtra,
    Wine:              wineExtra
};

const seasonIconMap = {
    Summer: summerIcon,
    Winter: winterIcon,
    Autumn: autumnIcon,
    Spring: springIcon,
};

const idealCounts = {
    Beer:              11,
    Cocktail:           8,
    Coffee:             6,
    Juices:             5,
    Mocktails:          7,
    'Soft Drinks':      6,
    Spirits:            9,
    'Sport/Energy Drinks': 4,
    'Tea & Infusions':  5,
    Wine:               10
};

const ToAdd = () => {
    const [sortOrder, setSortOrder] = useState('top');
    const [items, setItems] = useState([]);
    const [businessCity, setBusinessCity] = useState('');
    const [businessCountry, setBusinessCountry] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        segments: new Set(segmentOptions.map(o => o.id)),
        highlights: new Set(highlightOptions.map(o => o.id)),
        seasons: new Set(seasonOptions.map(o => o.id)),
        locations: new Set(locationOptions.map(o => o.id)),
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [countsByCategory, setCountsByCategory] = useState({});



// Fetch business address info
    useEffect(() => {
        axios.get('${process.env.REACT_APP_API_URL}/api/business-info', { withCredentials: true })
            .then(res => {
                // stel city én country in, vul default lege string in als ’t niet bestaat
                setBusinessCity(res.data.city || '');
                setBusinessCountry(res.data.country || '');
            })
            .catch(err => console.error('Business-info error', err));
    }, []);

    useEffect(() => {
        axios.get('${process.env.REACT_APP_API_URL}/api/menu-counts', { withCredentials: true })
            .then(res => {
                console.log('menu-counts raw:', res.data);
                const byCat = res.data.reduce((acc, { category, count_on_menu }) => {
                    acc[category] = count_on_menu;
                    return acc;
                }, {});
                console.log('mapped countsByCategory:', byCat);
                setCountsByCategory(byCat);
            })
            .catch(err => console.error(err));
    }, []);



    useEffect(() => {
        setLoading(true);
        axios.get('${process.env.REACT_APP_API_URL}/api/items-not-on-menu', { withCredentials: true })
            .then(res => {
                const mapped = res.data.map(i => ({
                    id: i.id_product,
                    name: i.name,
                    category: i.category,
                    high_margin:   Boolean(i.is_high_margin),
                    trending:      Boolean(i.is_trending),
                    eco_friendly:  Boolean(i.eco_friendly),
                    season: i.season,
                    prodCity: i.prodCity,
                    prodCountry: i.prodCountry,
                    // no sales data for ToAdd
                }));
                setItems(mapped);
            })
            .catch(err => { console.error(err); setError('Kon items niet laden'); })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading…</p>;
    if (error) return <p className="error">{error}</p>;

    const sorted = [...items].sort((a, b) => {
        if (sortOrder === 'name') return a.name.localeCompare(b.name);
        if (sortOrder === 'category') return a.category.localeCompare(b.category);
        return 0;
    });

    const visible = sorted.filter(item => {
        // 1) eerst de search-term
        if (!item.name.toLowerCase().includes(searchTerm.toLowerCase().replace(/[ &\/]/g,'_'))) {
            return false;
        }
        if(!filters.segments.has(item.category.toLowerCase())) return false;

        // highlight filter: must match any selected highlight if any toggled
        if(!filters.highlights.has(highlightOptions.find(o=>o.label==='High Margin').id) && item.high_margin === true) return false;
        if(!filters.highlights.has(highlightOptions.find(o=>o.label==='Trending').id) && item.trending === true) return false;
        if(!filters.highlights.has(highlightOptions.find(o=>o.label==='Eco-Friendly').id) && item.eco_friendly === true) return false;

        if(!filters.seasons.has(seasonOptions.find(o=>o.label==='Summer').id) && item.season === "Summer") return false;
        if(!filters.seasons.has(seasonOptions.find(o=>o.label==='Winter').id) && item.season === "Winter") return false;
        if(!filters.seasons.has(seasonOptions.find(o=>o.label==='Spring').id) && item.season === "Spring") return false;
        if(!filters.seasons.has(seasonOptions.find(o=>o.label==='Autumn').id) && item.season === "Autumn") return false;

        // 2) locatie-label bepalen met de wáárde uit je mapped object:
        let locLabel;
        if (item.prodCountry !== 'Belgium') {
            locLabel = 'Globally Sourced';
        } else {
            locLabel = (item.prodCity === businessCity)
                ? 'Locally Produced'
                : 'Made in Belgium';
        }

        // 3) filter op basis van die locLabel
        const locOpt = locationOptions.find(o => o.label === locLabel);
        if (!locOpt) {
            // geen optie gevonden? dan safe-side: niet tonen
            return false;
        }
        if (!filters.locations.has(locOpt.id)) {
            return false;
        }

        return true;
    });

    // net voor je return van de component
    const missingCategories = new Set(
        Object.entries(idealCounts)
            .filter(([cat, ideal]) => (countsByCategory[cat] || 0) < ideal)
            .map(([cat]) => cat)
    );


    return (
        <div className="top-worst-container">
            <div className="centre-content">
                <div className="segment-section">
                    <h2 className="section-title">Category Coverage</h2>
                    <p className="section-subtitle">
                        Compare your current menu assortment against our recommended targets.
                    </p>
                    <div className="segment-icons-grid">
                        {Object.entries(idealCounts).map(([category, ideal]) => {
                            const actual = countsByCategory[category] || 0;
                            const icons = [];

                            for (let i = 0; i < ideal; i++) {
                                // kies normale of missing icoon
                                const src = i < actual
                                    ? categoryIconMap[category]
                                    : missingIconMap[category];

                                icons.push(
                                    <img
                                        key={`${category}-${i}`}
                                        src={src}
                                        alt={category}
                                        title={`${category} (${actual}/${ideal})`}
                                        className="segment-icon"
                                    />
                                );
                            }

                            // extras voor te veel
                            if (actual > ideal) {
                                for (let i = ideal; i < actual; i++) {
                                    icons.push(
                                        <img
                                            key={`${category}-extra-${i}`}
                                            src={extraIconMap[category]}
                                            alt={category}
                                            title={`${category} (too many: ${actual - ideal})`}
                                            className="segment-icon"
                                        />
                                    );
                                }
                            }

                            return (
                                <div key={category} className="segment-row">
                                    <span className="segment-label">{category}</span>
                                    <div className="segment-icons">
                                        {icons}
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                </div>
                <div className="items-section">
                    {/* header */}
                    <div className="list-header">
                        <div className="header-title">
                            <p>To Add</p>
                            <h2 className="section-title-top">Menu-items</h2>
                        </div>

                        <div className="search-bar">
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* list */}
                    <ul className="items-list">
                        {visible.map((item, idx) => (
                            <li key={item.id} className="item">
                                <div className="item-main">
                                    <span className="item-rank">{idx + 1}.</span>
                                    <span className="item-name">{item.name}</span>
                                    <div className="item-icons">
                                        {/* category icon */}
                                        {item.category && categoryIconMap[item.category] && (
                                            <img
                                                src={categoryIconMap[item.category]}
                                                alt={item.category}
                                                title={item.category}
                                                className="category-icon"
                                            />
                                        )}
                                        {/* high margin */}
                                        {item.high_margin && (
                                            <img
                                                src={highMarginIcon}
                                                alt="High Margin"
                                                title="High Margin"
                                                className="highlight-icon"
                                            />
                                        )}
                                        {/* trending */}
                                        {item.trending && (
                                            <img
                                                src={trendingIcon}
                                                alt="Trending"
                                                title="Trending"
                                                className="highlight-icon"
                                            />
                                        )}
                                        {/* eco-friendly */}
                                        {item.eco_friendly && (
                                            <img
                                                src={ecoIcon}
                                                alt="Eco Friendly"
                                                title="Eco Friendly"
                                                className="highlight-icon"
                                            />
                                        )}
                                        {/* season */}
                                        {item.season !== 'Unknown' && seasonIconMap[item.season] && (
                                            <img
                                                src={seasonIconMap[item.season]}
                                                alt={item.season}
                                                title={item.season}
                                                className="highlight-icon"
                                            />
                                        )}
                                        {/* production location */}
                                        {item.prodCity && item.prodCountry && (

                                            <img
                                                src={
                                                    // same city => locally
                                                    item.prodCity === businessCity ? locallyIcon :
                                                        // same country (Belgium) => made in Belgium
                                                        (item.prodCountry === 'Belgium' ? belgiumIcon : globalIcon)
                                                }
                                                alt={
                                                    item.prodCity === businessCity ? 'Locally Produced' :
                                                        (item.prodCountry === 'Belgium' ? 'Made in Belgium' : 'Global')
                                                }
                                                title={
                                                    item.prodCity === businessCity ? 'Locally Produced' :
                                                        (item.prodCountry === 'Belgium' ? 'Made in Belgium' : 'Sourced Globally')
                                                }
                                                className="location-icon"
                                            />
                                        )}
                                        {/* markeer alle items uit een onderbezet segment */}
                                        {missingCategories.has(item.category) && (
                                            <img
                                                src={hotForYouIcon}
                                                alt="Hot for You"
                                                title="Hot for You"
                                                className="highlight-icon"
                                            />
                                        )}
                                    </div>
                                </div>

                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <Optionbar filters={filters} onChange={setFilters}/>
        </div>
    );
};

export default ToAdd;