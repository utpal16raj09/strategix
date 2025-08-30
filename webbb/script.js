document.addEventListener('DOMContentLoaded', () => {

    /**
     * Main initialization function that runs after the DOM is loaded.
     */
    function init() {
        initNavbarScroll();
        initHamburgerMenu(); // This function is now updated
        initScrollAnimations();
        initCursorTrail();
        initDemoComponent();
        populateCountryCodes();
    }

    /**
     * Adds a 'scrolled' class to the navbar when the page is scrolled.
     */
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    /**
     * Initializes the responsive hamburger menu with scroll-locking.
     */
    function initHamburgerMenu() {
        const hamburgerMenu = document.querySelector('.hamburger-menu');
        const navLinks = document.querySelector('.nav-links');
        const navOverlay = document.querySelector('.nav-overlay');
        const body = document.body;

        if (!hamburgerMenu || !navLinks || !navOverlay) return;

        let scrollPosition = 0;

        const openMenu = () => {
            // 1. Store the current scroll position
            scrollPosition = window.pageYOffset;

            // 2. Add class to freeze the body and apply top offset
            body.classList.add('menu-open');
            body.style.top = `-${scrollPosition}px`;

            // 3. Show the menu and overlay
            hamburgerMenu.classList.add('active');
            navLinks.classList.add('active');
            navOverlay.classList.add('active');
        };

        const closeMenu = () => {
            // 1. Remove the freezing class and inline style
            body.classList.remove('menu-open');
            body.style.top = '';

            // 2. Restore the original scroll position
            window.scrollTo(0, scrollPosition);

            // 3. Hide the menu and overlay
            hamburgerMenu.classList.remove('active');
            navLinks.classList.remove('active');
            navOverlay.classList.remove('active');
        };
        
        const toggleMenu = () => {
            if (navLinks.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        };

        hamburgerMenu.addEventListener('click', toggleMenu);
        navOverlay.addEventListener('click', closeMenu);

        // Close menu when a link is clicked
        const navItems = document.querySelectorAll('.nav-links a');
        navItems.forEach(item => {
            item.addEventListener('click', closeMenu);
        });
    }


    /**
     * Sets up animations that trigger when elements scroll into view.
     */
    function initScrollAnimations() {
        const elementsToReveal = document.querySelectorAll('.reveal-on-scroll');
        if (elementsToReveal.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        });

        elementsToReveal.forEach(element => observer.observe(element));
    }

    /**
     * Creates a dynamic, delayed cursor trail effect.
     */
    function initCursorTrail() {
        // This feature might not be ideal for mobile, so we can disable it
        if (window.innerWidth < 768) {
            return;
        }

        const DOT_COUNT = 15;
        const EASING_FACTOR = 0.5;

        const dots = [];
        const positions = [];
        const mouse = { x: 0, y: 0 };
        let hasMoved = false;

        for (let i = 0; i < DOT_COUNT; i++) {
            const dot = document.createElement('div');
            dot.classList.add('trail-dot');
            document.body.appendChild(dot);
            dots.push(dot);
            positions.push({ x: 0, y: 0 });
        }

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            if (!hasMoved) {
                document.body.classList.add('mouse-has-moved');
                hasMoved = true;
            }
        });

        function animateDots() {
            let targetX = mouse.x;
            let targetY = mouse.y;

            dots.forEach((dot, index) => {
                const pos = positions[index];
                pos.x += (targetX - pos.x) * EASING_FACTOR;
                pos.y += (targetY - pos.y) * EASING_FACTOR;
                dot.style.transform = `translate(${pos.x - 5}px, ${pos.y - 5}px)`;
                targetX = pos.x;
                targetY = pos.y;
            });

            requestAnimationFrame(animateDots);
        }
        animateDots();
    }

    /**
     * Handles all functionality for the interactive demo component.
     */
    function initDemoComponent() {
        const disc = document.getElementById('main-disc');
        const playBtn = document.getElementById('play-btn');
        const leftOptions = document.querySelectorAll('.left-panel .option');
        const rightOptions = document.querySelectorAll('.right-panel .option');
        const svg = document.getElementById('connectors');
        const discContainer = document.querySelector('.disc-container');

        if (!disc || !playBtn || !discContainer || !svg) return;

        const colors = {
            black: 'var(--metal-gradient-dark-blue)',
            bronze: 'linear-gradient(160deg, #a97142, #8c5e35, #a97142)',
            silver: 'var(--metal-gradient-silver)',
            gold: 'var(--metal-gradient-gold)',
            cd: 'var(--metal-gradient-dark-blue)'
        };

        let currentCharacter = 'black';

        function updateDiscColor() {
            disc.style.setProperty('--disc-background', colors[currentCharacter]);
        }

        function pointOnDiscEdge(towardX, towardY) {
            const discRect = disc.getBoundingClientRect();
            const cx = discRect.left + discRect.width / 2;
            const cy = discRect.top + discRect.height / 2;
            const r = discRect.width / 2;
            const vx = towardX - cx;
            const vy = towardY - cy;
            const len = Math.hypot(vx, vy) || 1;
            return { x: cx + (vx / len) * (r - 4), y: cy + (vy / len) * (r - 4) };
        }

        function toSvgCoords(x, y) {
            const s = svg.getBoundingClientRect();
            return { x: x - s.left, y: y - s.top };
        }

        function addConnector(fromElem, side) {
            const startRect = fromElem.getBoundingClientRect();
            const startPx = side === 'left' ? startRect.right : startRect.left;
            const startPy = startRect.top + startRect.height / 2;
            const endEdge = pointOnDiscEdge(startPx, startPy);
            const k = 0.35;
            const c1x = startPx + k * (endEdge.x - startPx);
            const c1y = startPy;
            const c2x = endEdge.x - k * (endEdge.x - startPx);
            const c2y = endEdge.y;
            const s1 = toSvgCoords(startPx, startPy);
            const c1 = toSvgCoords(c1x, c1y);
            const c2 = toSvgCoords(c2x, c2y);
            const e1 = toSvgCoords(endEdge.x, endEdge.y);
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M ${s1.x} ${s1.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${e1.x} ${e1.y}`);
            const L = path.getTotalLength ? path.getTotalLength() : 600;
            path.style.strokeDasharray = L;
            path.style.strokeDashoffset = L;
            svg.appendChild(path);
            path.getBoundingClientRect();
            path.style.strokeDashoffset = '0';
        }

        function drawConnectors() {
            svg.innerHTML = '';
            const leftActive = document.querySelector('.left-panel .option.active');
            const rightActive = document.querySelector('.right-panel .option.active');
            if (leftActive) addConnector(leftActive, 'left');
            if (rightActive) addConnector(rightActive, 'right');
        }

        leftOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                leftOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                drawConnectors();
            });
        });

        rightOptions.forEach(opt => {
            opt.addEventListener('click', () => {
                rightOptions.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                currentCharacter = opt.dataset.color;
                updateDiscColor();
                drawConnectors();
            });
        });

        let isPlaying = false;
        playBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            discContainer.classList.toggle('playing', isPlaying);
        });

        updateDiscColor();
        drawConnectors();
        window.addEventListener('resize', drawConnectors);
    }
    
    /**
     * Populates the country code dropdown with 3-letter uppercase names.
     */
    function populateCountryCodes() {
        const countries = [
            { name: 'ALG', code: '213' }, { name: 'AND', code: '376' },
            { name: 'ANG', code: '244' }, { name: 'ANG', code: '1264' },
            { name: 'ANT', code: '1268' }, { name: 'ARG', code: '54' },
            { name: 'ARM', code: '374' }, { name: 'ARU', code: '297' },
            { name: 'AUS', code: '43' }, { name: 'AZE', code: '994' },
            { name: 'BAH', code: '1242' }, { name: 'BAH', code: '973' },
            { name: 'BAN', code: '880' }, { name: 'BAR', code: '1246' },
            { name: 'BEL', code: '375' }, { name: 'BEL', code: '32' },
            { name: 'BEL', code: '501' }, { name: 'BEN', code: '229' },
            { name: 'BER', code: '1441' }, { name: 'BHU', code: '975' },
            { name: 'BOL', code: '591' }, { name: 'BOS', code: '387' },
            { name: 'BOT', code: '267' }, { name: 'BRA', code: '55' },
            { name: 'BRU', code: '673' }, { name: 'BUL', code: '359' },
            { name: 'BUR', code: '226' }, { name: 'BUR', code: '257' },
            { name: 'CAM', code: '855' }, { name: 'CAM', code: '237' },
            { name: 'CAN', code: '1' }, { name: 'CAP', code: '238' },
            { name: 'CAY', code: '1345' }, { name: 'CEN', code: '236' },
            { name: 'CHI', code: '56' }, { name: 'CHI', code: '86' },
            { name: 'COL', code: '57' }, { name: 'COM', code: '269' },
            { name: 'CON', code: '242' }, { name: 'COO', code: '682' },
            { name: 'COS', code: '506' }, { name: 'CRO', code: '385' },
            { name: 'CUB', code: '53' }, { name: 'CYP', code: '90392' },
            { name: 'CYP', code: '357' }, { name: 'CZE', code: '42' },
            { name: 'DEN', code: '45' }, { name: 'DJI', code: '253' },
            { name: 'DOM', code: '1809' }, { name: 'DOM', code: '1809' },
            { name: 'ECU', code: '593' }, { name: 'EGY', code: '20' },
            { name: 'ELS', code: '503' }, { name: 'EQU', code: '240' },
            { name: 'ERI', code: '291' }, { name: 'EST', code: '372' },
            { name: 'ETH', code: '251' }, { name: 'FAL', code: '500' },
            { name: 'FAR', code: '298' }, { name: 'FIJ', code: '679' },
            { name: 'FIN', code: '358' }, { name: 'FRA', code: '33' },
            { name: 'FRG', code: '594' }, { name: 'FRP', code: '689' },
            { name: 'GAB', code: '241' }, { name: 'GAM', code: '220' },
            { name: 'GEO', code: '7880' }, { name: 'GER', code: '49' },
            { name: 'GHA', code: '233' }, { name: 'GIB', code: '350' },
            { name: 'GRE', code: '30' }, { name: 'GRE', code: '299' },
            { name: 'GRE', code: '1473' }, { name: 'GUA', code: '590' },
            { name: 'GUA', code: '671' }, { name: 'GUA', code: '502' },
            { name: 'GUI', code: '224' }, { name: 'GUI', code: '245' },
            { name: 'GUY', code: '592' }, { name: 'HAI', code: '509' },
            { name: 'HON', code: '504' }, { name: 'HON', code: '852' },
            { name: 'HUN', code: '36' }, { name: 'ICE', code: '354' },
            { name: 'IND', code: '91' }, { name: 'IND', code: '62' },
            { name: 'IRA', code: '98' }, { name: 'IRA', code: '964' },
            { name: 'IRE', code: '353' }, { name: 'ISR', code: '972' },
            { name: 'ITA', code: '39' }, { name: 'JAM', code: '1876' },
            { name: 'JAP', code: '81' }, { name: 'JOR', code: '962' },
            { name: 'KAZ', code: '7' }, { name: 'KEN', code: '254' },
            { name: 'KIR', code: '686' }, { name: 'KOR', code: '850' },
            { name: 'KOR', code: '82' }, { name: 'KUW', code: '965' },
            { name: 'KYR', code: '996' }, { name: 'LAO', code: '856' },
            { name: 'LAT', code: '371' }, { name: 'LEB', code: '961' },
            { name: 'LES', code: '266' }, { name: 'LIB', code: '231' },
            { name: 'LIB', code: '218' }, { name: 'LIE', code: '417' },
            { name: 'LIT', code: '370' }, { name: 'LUX', code: '352' },
            { name: 'MAC', code: '853' }, { name: 'MAC', code: '389' },
            { name: 'MAD', code: '261' }, { name: 'MAL', code: '265' },
            { name: 'MAL', code: '60' }, { name: 'MAL', code: '960' },
            { name: 'MAL', code: '223' }, { name: 'MAL', code: '356' },
            { name: 'MAR', code: '692' }, { name: 'MAR', code: '596' },
            { name: 'MAU', code: '222' }, { name: 'MAY', code: '269' },
            { name: 'MEX', code: '52' }, { name: 'MIC', code: '691' },
            { name: 'MOL', code: '373' }, { name: 'MON', code: '377' },
            { name: 'MON', code: '976' }, { name: 'MON', code: '1664' },
            { name: 'MOR', code: '212' }, { name: 'MOZ', code: '258' },
            { name: 'MYA', code: '95' }, { name: 'NAM', code: '264' },
            { name: 'NAU', code: '674' }, { name: 'NEP', code: '977' },
            { name: 'NET', code: '31' }, { name: 'NEW', code: '687' },
            { name: 'NEW', code: '64' }, { name: 'NIC', code: '505' },
            { name: 'NIG', code: '227' }, { name: 'NIG', code: '234' },
            { name: 'NIU', code: '683' }, { name: 'NOR', code: '672' },
            { name: 'NOR', code: '670' }, { name: 'NOR', code: '47' },
            { name: 'OMA', code: '968' }, { name: 'PAL', code: '680' },
            { name: 'PAN', code: '507' }, { name: 'PAP', code: '675' },
            { name: 'PAR', code: '595' }, { name: 'PER', code: '51' },
            { name: 'PHI', code: '63' }, { name: 'POL', code: '48' },
            { name: 'POR', code: '351' }, { name: 'PUE', code: '1787' },
            { name: 'QAT', code: '974' }, { name: 'REU', code: '262' },
            { name: 'ROM', code: '40' }, { name: 'RUS', code: '7' },
            { name: 'RWA', code: '250' }, { name: 'SAN', code: '378' },
            { name: 'SAO', code: '239' }, { name: 'SAU', code: '966' },
            { name: 'SEN', code: '221' }, { name: 'SER', code: '381' },
            { name: 'SEY', code: '248' }, { name: 'SIE', code: '232' },
            { name: 'SIN', code: '65' }, { name: 'SLO', code: '421' },
            { name: 'SLO', code: '386' }, { name: 'SOL', code: '677' },
            { name: 'SOM', code: '252' }, { name: 'SOU', code: '27' },
            { name: 'SPA', code: '34' }, { name: 'SRI', code: '94' },
            { name: 'ST.', code: '290' }, { name: 'ST.', code: '1869' },
            { name: 'ST.', code: '1758' }, { name: 'SUD', code: '249' },
            { name: 'SUR', code: '597' }, { name: 'SWA', code: '268' },
            { name: 'SWE', code: '46' }, { name: 'SWI', code: '41' },
            { name: 'SYR', code: '963' }, { name: 'TAI', code: '886' },
            { name: 'TAJ', code: '7' }, { name: 'THA', code: '66' },
            { name: 'TOG', code: '228' }, { name: 'TON', code: '676' },
            { name: 'TRI', code: '1868' }, { name: 'TUN', code: '216' },
            { name: 'TUR', code: '90' }, { name: 'TUR', code: '993' },
            { name: 'TUR', code: '1649' }, { name: 'TUV', code: '688' },
            { name: 'UGA', code: '256' }, { name: 'UKR', code: '380' },
            { name: 'UAE', code: '971' }, { name: 'URU', code: '598' },
            { name: 'UZE', code: '7' }, { name: 'VAN', code: '678' },
            { name: 'VAT', code: '379' }, { name: 'VEN', code: '58' },
            { name: 'VIE', code: '84' }, { name: 'VIR', code: '1284' },
            { name: 'VIR', code: '1340' }, { name: 'WAL', code: '681' },
            { name: 'YEM', code: '967' }, { name: 'ZAM', code: '260' },
            { name: 'ZIM', code: '263' }
        ];

        const selectElement = document.querySelector('.country-code-select');
        if (selectElement) {
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = `+${country.code}`;
                option.textContent = `${country.name} (+${country.code})`;
                selectElement.appendChild(option);
            });
        }
    }

    // Run all initialization functions
    init();

});
