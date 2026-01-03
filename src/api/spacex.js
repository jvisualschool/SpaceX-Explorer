import axios from 'axios';

const SPACE_DEVS_API_URL = 'https://ll.thespacedevs.com/2.2.0';

// Transform Space Devs API data to match our app's expected format
const transformLaunchData = (launch) => {
    // Extract YouTube video ID from URL if available
    const getYouTubeId = (url) => {
        if (!url) return null;
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
        return match ? match[1] : null;
    };

    return {
        id: launch.id,
        name: launch.name,
        date_utc: launch.net, // net = No Earlier Than (launch time)
        date_unix: new Date(launch.net).getTime() / 1000,
        success: launch.status.id === 3, // 3 = Launch Successful
        launchpad: {
            name: launch.pad.name,
            latitude: parseFloat(launch.pad.latitude),
            longitude: parseFloat(launch.pad.longitude),
            region: launch.pad.location.name,
            full_name: launch.pad.name
        },
        rocket: {
            name: launch.rocket.configuration.name,
            type: launch.rocket.configuration.variant || launch.rocket.configuration.family
        },
        payloads: launch.mission ? [{
            id: launch.mission.id,
            name: launch.mission.name,
            type: launch.mission.type,
            orbit: launch.mission.orbit?.name || 'Unknown'
        }] : [],
        links: {
            patch: {
                small: launch.image || launch.mission_patches?.[0]?.image_url
            },
            flickr: {
                original: launch.image ? [launch.image] : []
            },
            youtube_ids: launch.vid_urls
                ? launch.vid_urls.map(v => getYouTubeId(v.url)).filter(id => id)
                : [],
            webcast: launch.vid_urls && launch.vid_urls.length > 0
                ? launch.vid_urls[0].url
                : null
        }
    };
};

const CACHE_KEY = 'spacex_launches_cache';
const CACHE_TIMESTAMP_KEY = 'spacex_launches_timestamp';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in ms

export const fetchRecentLaunches = async (limit = 20) => {
    // 1. Check Cache first
    try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
        const now = Date.now();

        if (cachedData && cachedTimestamp && (now - parseInt(cachedTimestamp) < CACHE_DURATION)) {
            console.log("Using cached SpaceX launch data");
            return JSON.parse(cachedData);
        }
    } catch (e) {
        console.warn("Error reading from cache", e);
    }

    try {
        console.log("Fetching fresh SpaceX launches from The Space Devs API...");
        // Fetch previous SpaceX launches from The Space Devs API
        const response = await axios.get(`${SPACE_DEVS_API_URL}/launch/previous/`, {
            params: {
                limit: limit,
                lsp__name: 'SpaceX', // Filter for SpaceX only
                ordering: '-net' // Sort by date descending (newest first)
            }
        });

        // Transform and filter data
        const launches = response.data.results
            .map(transformLaunchData)
            .filter(launch =>
                launch.launchpad &&
                typeof launch.launchpad.latitude === 'number' &&
                typeof launch.launchpad.longitude === 'number' &&
                !isNaN(launch.launchpad.latitude) &&
                !isNaN(launch.launchpad.longitude)
            );

        console.log(`Successfully fetched ${launches.length} SpaceX launches`);

        // 2. Save to Cache
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(launches));
            localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
        } catch (e) {
            console.warn("Error saving to cache", e);
        }

        return launches;
    } catch (error) {
        console.error("Error fetching Space Devs data:", error.response?.data?.detail || error.message);

        // 3. Last resort: Return old cache even if expired
        try {
            const expiredData = localStorage.getItem(CACHE_KEY);
            if (expiredData) {
                console.log("API Throttled/Error. Using expired cache as fallback.");
                return JSON.parse(expiredData);
            }
        } catch (e) { }

        console.log("No data available. Using static emergency fallback data.");
        return FALLBACK_LAUNCHES;
    }
};

// Emergency static data in case API is completely blocked on first load
const FALLBACK_LAUNCHES = [
    {
        id: "starlink-15-13",
        name: "Falcon 9 Block 5 | Starlink Group 15-13",
        date_utc: "2025-12-18T10:00:00Z",
        date_unix: 1766052000,
        success: true,
        launchpad: { name: "Space Launch Complex 40", latitude: 28.561941, longitude: -80.577357, region: "Cape Canaveral, FL, USA" },
        rocket: { name: "Falcon 9 Block 5", type: "Falcon 9" },
        payloads: [{ id: "starlink-1", name: "Starlink", type: "Communication", orbit: "LEO" }],
        links: { patch: { small: null }, flickr: { original: [] }, youtube_ids: ["hI9HQfCAw64"], webcast: null }
    },
    {
        id: "starlink-15-12",
        name: "Falcon 9 Block 5 | Starlink Group 15-12",
        date_utc: "2025-12-17T09:00:00Z",
        date_unix: 1765965600,
        success: true,
        launchpad: { name: "Space Launch Complex 4E", latitude: 34.632, longitude: -120.61, region: "Vandenberg SFB, CA, USA" },
        rocket: { name: "Falcon 9 Block 5", type: "Falcon 9" },
        payloads: [{ id: "starlink-2", name: "Starlink", type: "Communication", orbit: "LEO" }],
        links: { patch: { small: null }, flickr: { original: [] }, youtube_ids: ["j2BdNDTlWbo"], webcast: null }
    },
    {
        id: "starlink-15-11",
        name: "Falcon 9 Block 5 | Starlink Group 15-11",
        date_utc: "2025-12-15T15:00:00Z",
        date_unix: 1765814400,
        success: true,
        launchpad: { name: "LC-39A", latitude: 28.608, longitude: -80.604, region: "Kennedy Space Center, FL" },
        rocket: { name: "Falcon 9 Block 5", type: "Falcon 9" },
        payloads: [{ id: "starlink-3", name: "Starlink", type: "Communication", orbit: "LEO" }],
        links: { patch: { small: null }, flickr: { original: [] }, youtube_ids: ["rcd_SQZDlnk"], webcast: null }
    },
    {
        id: "crs-31",
        name: "Falcon 9 | CRS-31",
        date_utc: "2024-11-04T02:29:00Z",
        date_unix: 1730687340,
        success: true,
        launchpad: { name: "LC-39A", latitude: 28.608, longitude: -80.604, region: "Kennedy Space Center, FL" },
        rocket: { name: "Falcon 9", type: "Falcon 9" },
        payloads: [{ id: "cargo", name: "Cargo Dragon", type: "Resupply", orbit: "LEO" }],
        links: { patch: { small: null }, flickr: { original: [] }, youtube_ids: ["Pn6e1O5bEyA"], webcast: null }
    },
    {
        id: "starlink-6-85",
        name: "Falcon 9 | Starlink Group 6-85",
        date_utc: "2025-11-15T12:00:00Z",
        date_unix: 1763208000,
        success: true,
        launchpad: { name: "SLC-40", latitude: 28.5619, longitude: -80.5773, region: "Cape Canaveral, FL" },
        rocket: { name: "Falcon 9", type: "Falcon 9" },
        payloads: [{ id: "starlink-4", name: "Starlink", type: "Communication", orbit: "LEO" }],
        links: { patch: { small: null }, flickr: { original: [] }, youtube_ids: ["hI9HQfCAw64"], webcast: null }
    }
];
