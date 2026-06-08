use wasm_bindgen::prelude::*;
use web_sys::Window;
use js_sys::Object;

#[wasm_bindgen]
pub struct TrackerConfig {
    website_id: String,
    host_url: String,
    endpoint: String,
    tag: Option<String>,
    auto_track: bool,
    do_not_track: bool,
    exclude_search: bool,
    exclude_hash: bool,
    domains: Vec<String>,
    fetch_credentials: String,
}

#[wasm_bindgen]
impl TrackerConfig {
    #[wasm_bindgen(constructor)]
    pub fn new(
        website_id: String,
        host_url: String,
        endpoint: String,
        tag: Option<String>,
        auto_track: bool,
        do_not_track: bool,
        exclude_search: bool,
        exclude_hash: bool,
        domains: Vec<String>,
        fetch_credentials: String,
    ) -> TrackerConfig {
        TrackerConfig {
            website_id,
            host_url,
            endpoint,
            tag,
            auto_track,
            do_not_track,
            exclude_search,
            exclude_hash,
            domains,
            fetch_credentials,
        }
    }

    pub fn website_id(&self) -> String {
        self.website_id.clone()
    }

    pub fn endpoint(&self) -> String {
        self.endpoint.clone()
    }

    pub fn tag(&self) -> Option<String> {
        self.tag.clone()
    }

    pub fn auto_track(&self) -> bool {
        self.auto_track
    }

    pub fn do_not_track(&self) -> bool {
        self.do_not_track
    }
}

#[wasm_bindgen]
pub struct Tracker {
    config: TrackerConfig,
}

#[wasm_bindgen]
impl Tracker {
    #[wasm_bindgen(constructor)]
    pub fn new(config: TrackerConfig) -> Tracker {
        Tracker { config }
    }

    #[wasm_bindgen]
    pub fn init(&self) {
        // Initialization logic
        web_sys::console::log_1(&"Umami Tracker initialized".into());
    }

    #[wasm_bindgen]
    pub fn track(&self, event_data: &str) -> bool {
        // Tracking logic
        match serde_json::from_str::<serde_json::Value>(event_data) {
            Ok(data) => {
                web_sys::console::log_1(&format!("Tracking event: {:?}", data).into());
                true
            }
            Err(_) => false,
        }
    }

    #[wasm_bindgen]
    pub fn get_website_id(&self) -> String {
        self.config.website_id()
    }
}

/// Normalize URLs (remove query/hash if needed)
#[wasm_bindgen]
pub fn normalize_url(url: &str, exclude_search: bool, exclude_hash: bool) -> String {
    // For now, return the URL as-is
    // Full implementation would parse and normalize URLs
    url.to_string()
}
