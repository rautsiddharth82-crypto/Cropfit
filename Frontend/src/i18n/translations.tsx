import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

export const translations = {
  en: {
    // Navigation / Tabs
    nav_home: 'Home Dashboard',
    nav_farm: 'My Farm',
    nav_climate: 'Climate & Agriculture',
    nav_testing: 'Soil & Water Testing',
    nav_disease: 'Plant Disease Scanner',
    nav_schemes: 'Government Schemes',
    nav_simulator: 'Crop Simulator',
    nav_financials: 'Financials & Profits',
    nav_ai: 'AI Agronomist',
    nav_journal: 'Farm Journal',
    nav_nutriblend: 'NutriBlend (Fertilizer)',
    logout: 'Log Out',
    location: 'Location',
    acres: 'Acres',

    // Header & Search
    good_morning: 'Good Morning',
    good_afternoon: 'Good Afternoon',
    good_evening: 'Good Evening',
    search_placeholder: 'Search crops, weather, diseases, schemes...',
    ask_ai_btn: 'Ask AI',
    undo: 'Undo',
    redo: 'Redo',
    notifications: 'Notifications',
    settings: 'Settings',

    // Common
    view_details: 'View Details',
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
    submit: 'Submit',
    reset: 'Reset',
    filter: 'Filter',
    all: 'All',
    action_required: 'Action Required',
    status: 'Status',
    today: 'Today',
    download_report: 'Download Report',
    share: 'Share',

    // Home View
    home_banner_title: 'Smart Precision Agriculture & Climate Resilience',
    home_banner_desc: 'Real-time microclimate sensors, thermal stress forecast, and AI agronomic decisions.',
    today_weather: "Today's Weather Overview",
    early_warning_title: 'Early Warning Thermal Stress Alert',
    early_warning_tag: 'High Heatwave Advisory',
    early_warning_desc: 'Temperatures reaching 35°C during sensitive wheat flowering stage (Zadoks 65). Immediate micro-irrigation advised.',
    view_why_alert: 'Why is this alert shown?',
    view_action_plan: 'View AI Action Plan',
    main_features: 'Main Agriculture Features',
    home_quick_actions: 'Quick Farm Actions',
    feature_farm_title: 'Field Boundaries & Sensors',
    feature_farm_desc: 'Manage your plots with live IoT moisture and nutrient telemetry.',
    feature_climate_title: 'Hourly Weather Dial & Clock',
    feature_climate_desc: 'Optimal 24-hour farming action windows for spraying and watering.',
    feature_testing_title: 'Lab Soil & Water Testing',
    feature_testing_desc: 'Track NPK, pH, EC salinity, and AI fertilizer dose corrections.',
    feature_disease_title: 'AI Crop Leaf Scanner',
    feature_disease_desc: 'Instant disease identification, chemical dosage & organic remedies.',
    feature_schemes_title: 'Subsidies & Direct Benefits',
    feature_schemes_desc: 'PM-KUSUM, PMFBY insurance, Drip subsidies with eligibility checks.',
    feature_simulator_title: 'What-If Climate Simulator',
    feature_simulator_desc: 'Simulate heatwaves, drought, and yield impact before making decisions.',
    feature_financials_title: 'Season Revenue & Profit',
    feature_financials_desc: 'Track seed, fertilizer, spray costs vs market realization.',
    feature_ai_title: 'AI Kisan Expert Agronomist',
    feature_ai_desc: 'Ask any farming query in your language with localized knowledge.',
    feature_journal_title: 'Digital Farm Journal',
    feature_journal_desc: 'Log irrigation, sprays, fertilizer applications, and crop outcomes.',

    // Climate View
    climate_title: '24-Hour Farm Action Clock',
    climate_subtitle: 'Optimal operational windows for spraying, fertilizing, and irrigating',
    hourly_legend_good: 'Optimal Action Window',
    hourly_legend_caution: 'Moderate Caution',
    hourly_legend_avoid: 'High Heat / Avoid Spray',
    forecast_5day: '5-Day Climate Forecast',
    what_why_when_how: 'Action Advisory: What, Why, When & How',

    // My Farm View
    farm_title: 'Precision Farm Plot Management',
    field_01: 'Field 01 (Wheat HD-3086)',
    field_02: 'Field 02 (Mustard Pusa-Bold)',
    field_03: 'Field 03 (Gram Chickpea)',
    soil_moisture: 'Soil Moisture',
    nitrogen_level: 'Nitrogen Level',
    crop_stage: 'Growth Stage',
    thermal_stress: 'Thermal Stress',
    irrigation_action: 'Recommended Action',

    // Soil & Water Testing
    testing_title: 'Soil Health & Water Quality Testing',
    soil_tab: 'Soil Nutrient Testing',
    water_tab: 'Irrigation Water Quality',
    reports_tab: 'Lab Test Reports',
    opt_apply_soil: 'Apply for Soil Testing',
    opt_apply_water: 'Apply for Water Quality Test',
    opt_govt_soil_report: 'Soil Report by Government',
    opt_all_reports: 'All the Reports Data',
    overall_health_score: 'Soil Health Score',
    ph_level: 'pH Level',
    organic_carbon: 'Organic Carbon',
    nitrogen_status: 'Available Nitrogen (N)',
    phosphorus_status: 'Phosphorus (P₂O₅)',
    potassium_status: 'Potassium (K₂O)',
    zinc_iron: 'Micronutrients (Zn / Fe)',
    ai_remedy: 'AI Dosage Correction Advice',

    // Disease View
    disease_title: 'AI Crop Disease Diagnostic & Scanner',
    scan_leaf_tab: 'Scan Live Crop Leaf',
    known_diseases_tab: 'Regional Disease Library',
    drop_leaf_photo: 'Upload or drop a crop leaf photo to diagnose',
    symptoms: 'Observed Symptoms',
    chemical_cure: 'Chemical Fungicide / Pesticide Cure',
    organic_cure: 'Organic / Bio-Pesticide Solution',
    preventive_steps: 'Preventive Best Practices',

    // Schemes View
    schemes_title: 'Government Subsidies & Farmer Welfare Schemes',
    eligible_schemes: 'Available Schemes for You',
    subsidy_amount: 'Subsidy Benefit',
    eligibility_criteria: 'Eligibility Criteria',
    documents_needed: 'Required Documents',
    apply_portal: 'Apply on Official Portal',

    // Simulator View
    simulator_title: 'Interactive "What-If" Agronomic Simulator',
    temp_shift: 'Temperature Shift',
    rain_variation: 'Rainfall Variation',
    irrigation_system: 'Irrigation System',
    pest_risk: 'Pest Outbreak Risk',
    projected_yield: 'Projected Yield Impact',
    water_needed: 'Water Consumption',
    profit_shift: 'Net Profit Shift',
    soil_health: 'Soil Health Index',
    ai_verdict: 'AI Agronomist Physics Explanation',

    // Financials View
    financials_title: 'Season-Wise Farm Revenue & Profit Analytics',
    gross_revenue: 'Gross Revenue',
    total_expenses: 'Total Crop Expenses',
    net_profit: 'Net Profit Realized',
    profit_per_acre: 'Profit Per Acre',
    expense_breakdown: 'Expense Breakdown (Seeds, Fertilizers, Labor, Energy)',
    ai_profit_tips: 'AI Profit Maximization Insights',

    // AI View
    ai_title: 'AI Kisan Expert Agronomist',
    ai_desc: 'Ask questions about pests, fertilizer scheduling, weather protection, or crop selection.',
    ask_ai_placeholder: 'Type your farming question (e.g. How to protect flowering wheat from heat?)',
    send: 'Ask AI',
    listening: 'Listening to your voice...',
    memory_title: 'AI Farm History & Learned Context',

    // Journal View
    journal_title: 'Digital Farm Journal & Field Diary',
    write_entry: '+ Write In Journal',
    entry_title: 'Activity Summary',
    entry_type: 'Activity Type',
    target_field: 'Target Field',
    field_notes: 'Field Notes & Observations',
    attach_photo: 'Attach Field Photo',
    observed_stress: 'Observed Stress Feedback',
    action_result: 'Action Outcome'
  },
  hi: {
    // Navigation / Tabs
    nav_home: 'मुख्य डैशबोर्ड',
    nav_farm: 'मेरा खेत',
    nav_climate: 'मौसम व कृषि',
    nav_testing: 'मिट्टी व पानी जांच',
    nav_disease: 'फसल रोग पहचान',
    nav_schemes: 'सरकारी योजनाएं',
    nav_simulator: 'फसल सिम्युलेटर',
    nav_financials: 'आय-व्यय व मुनाफा',
    nav_ai: 'एआई कृषि विशेषज्ञ',
    nav_journal: 'कृषि डायरी',
    nav_nutriblend: 'NutriBlend (खाद संतुलन)',
    logout: 'लॉग आउट',
    location: 'स्थान',
    acres: 'एकड़',

    // Header & Search
    good_morning: 'शुभ प्रभात',
    good_afternoon: 'नमस्कार / शुभ दोपहर',
    good_evening: 'शुभ संध्या',
    search_placeholder: 'फसल, मौसम, रोग, खाद, योजनाएं खोजें...',
    ask_ai_btn: 'एआई से पूछें',
    undo: 'पूर्ववत (Undo)',
    redo: 'फिर से (Redo)',
    notifications: 'सूचनाएं',
    settings: 'सेटिंग्स',

    // Common
    view_details: 'विवरण देखें',
    close: 'बंद करें',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    submit: 'जमा करें',
    reset: 'रीसेट करें',
    filter: 'फ़िल्टर',
    all: 'सभी',
    action_required: 'तत्काल कार्रवाई आवश्यक',
    status: 'स्थिति',
    today: 'आज',
    download_report: 'रिपोर्ट डाउनलोड करें',
    share: 'साझा करें',

    // Home View
    home_banner_title: 'स्मार्ट परिशुद्ध कृषि एवं जलवायु सुरक्षा',
    home_banner_desc: 'रीयल-टाइम मौसम सेंसर, हीटवेव पूर्व चेतावनी और एआई आधारित कृषि परामर्श।',
    today_weather: 'आज का मौसम अवलोकन',
    early_warning_title: 'हीटवेव व अत्यधिक तापमान चेतावनी',
    early_warning_tag: 'उच्च तापमान अलर्ट',
    early_warning_desc: 'गेहूं की फूल अवस्था में तापमान 35°C पहुंचने की संभावना है। दानों को सूखने से बचाने के लिए सुबह हल्की सिंचाई करें।',
    view_why_alert: 'यह चेतावनी क्यों दिखाई गई है?',
    view_action_plan: 'एआई सुरक्षा योजना देखें',
    main_features: 'मुख्य कृषि सेवाएं एवं सुविधाएं',
    home_quick_actions: 'खेत के त्वरित कार्य',
    feature_farm_title: 'खेत की सीमाएं व सेंसर',
    feature_farm_desc: 'अपने खेतों में मिट्टी की नमी, नाइट्रोजन और फसल की स्थिति लाइव देखें।',
    feature_climate_title: '24-घंटे का मौसम चक्र व घड़ी',
    feature_climate_desc: 'स्प्रे करने, खाद डालने और सिंचाई करने का सबसे उपयुक्त समय जानें।',
    feature_testing_title: 'मिट्टी व सिंचाई जल परीक्षण',
    feature_testing_desc: 'NPK, pH, लवणता और सही खाद की मात्रा की सटीक सलाह प्राप्त करें।',
    feature_disease_title: 'एआई फसल पत्ता रोग स्कैनर',
    feature_disease_desc: 'पत्ते का फोटो खींचकर तुरंत रोग पहचानें और जैविक व रासायनिक इलाज पाएं।',
    feature_schemes_title: 'सरकारी सब्सिडी एवं योजनाएं',
    feature_schemes_desc: 'पीएम-कुसुम सोलर पंप, फसल बीमा (PMFBY), ड्रिप सब्सिडी की पात्रता जांचें।',
    feature_simulator_title: 'फसल व मौसम सिम्युलेटर',
    feature_simulator_desc: 'सूखा, लू और पानी के बदलाव का फसल उत्पादन पर असर पहले ही देखें।',
    feature_financials_title: 'मौसम अनुसार फसल आय-व्यय',
    feature_financials_desc: 'बीज, खाद, मजदूरी खर्च बनाम बाजार भाव का पूरा वित्तीय हिसाब रखें।',
    feature_ai_title: 'एआई किसान मित्र परामर्शदाता',
    feature_ai_desc: 'अपनी भाषा में बोलकर या लिखकर खेती का कोई भी सवाल पूछें।',
    feature_journal_title: 'डिजिटल किसान डायरी',
    feature_journal_desc: 'सिंचाई, स्प्रे, खाद का खर्च और परिणाम अपनी डिजिटल डायरी में नोट करें।',

    // Climate View
    climate_title: '24-घंटे का कृषि कार्य समय चक्र',
    climate_subtitle: 'स्प्रे, खाद एवं सिंचाई करने के लिए सबसे सुरक्षित और असरदार समय',
    hourly_legend_good: 'सर्वोत्तम समय (सुरक्षित)',
    hourly_legend_caution: 'मध्यम सावधानी',
    hourly_legend_avoid: 'अत्यधिक गर्मी / स्प्रे न करें',
    forecast_5day: 'आगामी 5 दिनों का मौसम पूर्वानुमान',
    what_why_when_how: 'कृषि परामर्श: क्या, क्यों, कब और कैसे करें',

    // My Farm View
    farm_title: 'सटीक खेत व फसल प्रबंधन',
    field_01: 'खेत 01 (गेहूं HD-3086)',
    field_02: 'खेत 02 (सरसों पूसा-बोल्ड)',
    field_03: 'खेत 03 (चना देसी)',
    soil_moisture: 'मिट्टी की नमी',
    nitrogen_level: 'नाइट्रोजन स्तर',
    crop_stage: 'फसल विकास चरण',
    thermal_stress: 'तापमान तनाव (हीट स्ट्रेस)',
    irrigation_action: 'सुझाई गई कार्रवाई',

    // Soil & Water Testing
    testing_title: 'मृदा स्वास्थ्य एवं सिंचाई जल गुणवत्ता जांच',
    soil_tab: 'मिट्टी पोषण परीक्षण',
    water_tab: 'सिंचाई पानी की गुणवत्ता',
    reports_tab: 'प्रयोगशाला रिपोर्ट',
    opt_apply_soil: 'मिट्टी परीक्षण के लिए आवेदन करें',
    opt_apply_water: 'पानी की गुणवत्ता परीक्षण के लिए आवेदन करें',
    opt_govt_soil_report: 'सरकार द्वारा मृदा रिपोर्ट',
    opt_all_reports: 'सभी रिपोर्ट डेटा',
    overall_health_score: 'मिट्टी स्वास्थ्य स्कोर',
    ph_level: 'पीएच (pH) स्तर',
    organic_carbon: 'जैविक कार्बन (%)',
    nitrogen_status: 'उपलब्ध नाइट्रोजन (N)',
    phosphorus_status: 'फास्फोरस (P₂O₅)',
    potassium_status: 'पोटाश (K₂O)',
    zinc_iron: 'सूक्ष्म पोषक तत्व (जिंक / आयरन)',
    ai_remedy: 'एआई खाद सुधार एवं खुराक परामर्श',

    // Disease View
    disease_title: 'एआई फसल रोग निदान एवं पत्ता स्कैनर',
    scan_leaf_tab: 'फसल के पत्ते को स्कैन करें',
    known_diseases_tab: 'क्षेत्रीय फसल रोग लाइब्रेरी',
    drop_leaf_photo: 'रोग पहचानने के लिए पत्ते की फोटो अपलोड करें या खींचें',
    symptoms: 'रोग के लक्षण',
    chemical_cure: 'रासायनिक कवकनाशी / कीटनाशक उपचार',
    organic_cure: 'जैविक / देशी उपचार विधि',
    preventive_steps: 'रोकथाम के सुरक्षात्मक उपाय',

    // Schemes View
    schemes_title: 'सरकारी कृषि योजनाएं एवं सब्सिडी पोर्टल',
    eligible_schemes: 'आपके लिए उपयुक्त योजनाएं',
    subsidy_amount: 'सब्सिडी व लाभ',
    eligibility_criteria: 'पात्रता की शर्तें',
    documents_needed: 'आवश्यक दस्तावेज',
    apply_portal: 'आधिकारिक पोर्टल पर आवेदन करें',

    // Simulator View
    simulator_title: 'इंटरैक्टिव "व्हाट-इफ" फसल एवं जलवायु सिम्युलेटर',
    temp_shift: 'तापमान में बदलाव',
    rain_variation: 'वर्षा में कमी या बढ़ोतरी',
    irrigation_system: 'सिंचाई तकनीक',
    pest_risk: 'कीट व बीमारी का जोखिम',
    projected_yield: 'अनुमानित उत्पादन बदलाव',
    water_needed: 'पानी की आवश्यकता',
    profit_shift: 'शुद्ध मुनाफे में असर',
    soil_health: 'मृदा स्वास्थ्य सूचकांक',
    ai_verdict: 'एआई वैज्ञानिक विश्लेषण व निष्कर्ष',

    // Financials View
    financials_title: 'फसल अनुसार आय, खर्च एवं शुद्ध मुनाफा विश्लेषण',
    gross_revenue: 'कुल आमदनी (Gross Revenue)',
    total_expenses: 'कुल लागत खर्च (Expenses)',
    net_profit: 'शुद्ध बचत / मुनाफा (Net Profit)',
    profit_per_acre: 'प्रति एकड़ शुद्ध मुनाफा',
    expense_breakdown: 'खर्च का विवरण (बीज, खाद, कीटनाशक, डीजल/बिजली, कटाई)',
    ai_profit_tips: 'एआई मुनाफा वृद्धि सुझाव',

    // AI View
    ai_title: 'एआई किसान मित्र एवं कृषि विशेषज्ञ',
    ai_desc: 'फसल कीट, खाद की मात्रा, मौसम से बचाव या नई फसल चयन पर कोई भी सवाल पूछें।',
    ask_ai_placeholder: 'अपना कृषि सवाल लिखें (जैसे: गेहूं में बालियां आने पर लू से कैसे बचाएं?)',
    send: 'पूछें',
    listening: 'आपकी आवाज सुनी जा रही है...',
    memory_title: 'खेत का पिछला इतिहास व सीखी गई बातें',

    // Journal View
    journal_title: 'डिजिटल किसान डायरी एवं फील्ड लॉग',
    write_entry: '+ डायरी में नया नोट लिखें',
    entry_title: 'कार्य का शीर्षक',
    entry_type: 'कार्य का प्रकार',
    target_field: 'संबंधित खेत',
    field_notes: 'खेत के मुख्य निरीक्षण एवं नोट्स',
    attach_photo: 'खेत का फोटो जोड़ें',
    observed_stress: 'फसल पर असर फीडबैक',
    action_result: 'किए गए कार्य का परिणाम'
  },
  pa: {
    // Navigation / Tabs
    nav_home: 'ਮੁੱਖ ਡੈਸ਼ਬੋਰਡ',
    nav_farm: 'ਮੇਰਾ ਖੇਤ',
    nav_climate: 'ਮੌਸਮ ਅਤੇ ਖੇਤੀਬਾੜੀ',
    nav_testing: 'ਮਿੱਟੀ ਅਤੇ ਪਾਣੀ ਟੈਸਟ',
    nav_disease: 'ਫ਼ਸਲ ਬਿਮਾਰੀ ਸਕੈਨਰ',
    nav_schemes: 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ',
    nav_simulator: 'ਫ਼ਸਲ ਸਿਮੂਲੇਟਰ',
    nav_financials: 'ਮੁਨਾਫ਼ਾ ਅਤੇ ਖ਼ਰਚੇ',
    nav_ai: 'ਏਆਈ ਖੇਤੀ ਮਾਹਿਰ',
    nav_journal: 'ਖੇਤੀ ਡਾਇਰੀ',
    nav_nutriblend: 'ਨਿਊਟ੍ਰੀਬਲੈਂਡ (ਖਾਦ ਸੰਤੁਲਨ)',
    logout: 'ਲਾਗ ਆਊਟ',
    location: 'ਟਿਕਾਣਾ',
    acres: 'ਏਕੜ',

    // Header & Search
    good_morning: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ / ਸ਼ੁਭ ਸਵੇਰ',
    good_afternoon: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ / ਦੁਪਹਿਰ ਬਖ਼ੈਰ',
    good_evening: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ / ਸ਼ੁਭ ਸ਼ਾਮ',
    search_placeholder: 'ਫ਼ਸਲ, ਮੌਸਮ, ਬਿਮਾਰੀ, ਖਾਦ, ਸਕੀਮਾਂ ਲੱਭੋ...',
    ask_ai_btn: 'ਏਆਈ ਤੋਂ ਪੁੱਛੋ',
    undo: 'ਵਾਪਸ (Undo)',
    redo: 'ਅੱਗੇ (Redo)',
    notifications: 'ਸੂਚਨਾਵਾਂ',
    settings: 'ਸੈਟਿੰਗਾਂ',

    // Common
    view_details: 'ਵੇਰਵਾ ਵੇਖੋ',
    close: 'ਬੰਦ ਕਰੋ',
    cancel: 'ਰੱਦ ਕਰੋ',
    save: 'ਸੇਵ ਕਰੋ',
    submit: 'ਜਮ੍ਹਾਂ ਕਰੋ',
    reset: 'ਰੀਸੈਟ ਕਰੋ',
    filter: 'ਫ਼ਿਲਟਰ',
    all: 'ਸਾਰੇ',
    action_required: 'ਤੁਰੰਤ ਕਾਰਵਾਈ ਲੋੜੀਂਦੀ',
    status: 'ਹਾਲਤ',
    today: 'ਅੱਜ',
    download_report: 'ਰਿਪੋਰਟ ਡਾਊਨਲੋਡ ਕਰੋ',
    share: 'ਸਾਂਝਾ ਕਰੋ',

    // Home View
    home_banner_title: 'ਸਮਾਰਟ ਸਟੀਕ ਖੇਤੀਬਾੜੀ ਅਤੇ ਮੌਸਮ ਸੁਰੱਖਿਆ',
    home_banner_desc: 'ਰੀਅਲ-ਟਾਈਮ ਮੌਸਮ ਸੈਂਸਰ, ਹੀਟਵੇਵ ਚਿਤਾਵਨੀ ਅਤੇ ਏਆਈ ਖੇਤੀ ਸਲਾਹ।',
    today_weather: 'ਅੱਜ ਦਾ ਮੌਸਮ ਸਾਰ',
    early_warning_title: 'ਗਰਮੀ ਦੀ ਲਹਿਰ ਅਤੇ ਉੱਚ ਤਾਪਮਾਨ ਚਿਤਾਵਨੀ',
    early_warning_tag: 'ਹੀਟਵੇਵ ਅਲਰਟ',
    early_warning_desc: 'ਕਣਕ ਦੇ ਫੁੱਲ ਪੈਣ ਵੇਲੇ ਤਾਪਮਾਨ 35°C ਤੱਕ ਵਧਣ ਦਾ ਖ਼ਦਸ਼ਾ ਹੈ। ਦਾਣੇ ਸੜਨ ਤੋਂ ਬਚਾਉਣ ਲਈ ਸਵੇਰੇ ਹਲਕਾ ਪਾਣੀ ਲਾਓ।',
    view_why_alert: 'ਇਹ ਚਿਤਾਵਨੀ ਕਿਉਂ ਦਿੱਤੀ ਗਈ ਹੈ?',
    view_action_plan: 'ਏਆਈ ਸੁਰੱਖਿਆ ਯੋਜਨਾ ਵੇਖੋ',
    main_features: 'ਮੁੱਖ ਖੇਤੀਬਾੜੀ ਸੇਵਾਵਾਂ',
    home_quick_actions: 'ਖੇਤ ਦੇ ਜ਼ਰੂਰੀ ਕੰਮ',
    feature_farm_title: 'ਖੇਤ ਦੇ ਰਕਬੇ ਅਤੇ ਸੈਂਸਰ',
    feature_farm_desc: 'ਆਪਣੇ ਖੇਤ ਵਿੱਚ ਨਮੀ, ਨਾਈਟ੍ਰੋਜਨ ਅਤੇ ਫ਼ਸਲ ਦੀ ਹਾਲਤ ਲਾਈਵ ਵੇਖੋ।',
    feature_climate_title: '24-ਘੰਟੇ ਦਾ ਮੌਸਮ ਚੱਕਰ',
    feature_climate_desc: 'ਸਪਰੇਅ, ਖਾਦ ਅਤੇ ਪਾਣੀ ਲਾਉਣ ਦਾ ਸਭ ਤੋਂ ਢੁੱਕਵਾਂ ਸਮਾਂ ਜਾਣੋ।',
    feature_testing_title: 'ਮਿੱਟੀ ਅਤੇ ਸਿੰਚਾਈ ਪਾਣੀ ਟੈਸਟਿੰਗ',
    feature_testing_desc: 'NPK, pH, ਖਾਰੇਪਣ ਅਤੇ ਖਾਦ ਦੀ ਸਹੀ ਮਾਤਰਾ ਬਾਰੇ ਸਲਾਹ ਲਵੋ।',
    feature_disease_title: 'ਏਆਈ ਪੱਤਾ ਰੋਗ ਸਕੈਨਰ',
    feature_disease_desc: 'ਪੱਤੇ ਦੀ ਫੋਟੋ ਖਿੱਚ ਕੇ ਤੁਰੰਤ ਬਿਮਾਰੀ ਪਛਾਣੋ ਅਤੇ ਇਲਾਜ ਪਾਓ।',
    feature_schemes_title: 'ਸਰਕਾਰੀ ਸਬਸਿਡੀਆਂ ਅਤੇ ਸਕੀਮਾਂ',
    feature_schemes_desc: 'ਪੀਐਮ-ਕੁਸੁਮ ਸੋਲਰ ਪੰਪ, ਫ਼ਸਲ ਬੀਮਾ (PMFBY), ਤੁਪਕਾ ਸਿੰਚਾਈ ਸਬਸਿਡੀ।',
    feature_simulator_title: 'ਫ਼ਸਲ ਅਤੇ ਮੌਸਮ ਸਿਮੂਲੇਟਰ',
    feature_simulator_desc: 'ਸੋਕੇ ਅਤੇ ਗਰਮੀ ਦਾ ਝਾੜ ਉੱਤੇ ਅਸਰ ਪਹਿਲਾਂ ਹੀ ਪਰਖੋ।',
    feature_financials_title: 'ਸੀਜ਼ਨ ਮੁਤਾਬਕ ਆਮਦਨ ਅਤੇ ਖ਼ਰਚਾ',
    feature_financials_desc: 'ਬੀਜ, ਖਾਦ, ਸਪਰੇਅ ਖ਼ਰਚੇ ਅਤੇ ਮੁਨਾਫ਼ੇ ਦਾ ਪੂਰਾ ਹਿਸਾਬ-ਕਿਤਾਬ।',
    feature_ai_title: 'ਏਆਈ ਕਿਸਾਨ ਮਿੱਤਰ',
    feature_ai_desc: 'ਆਪਣੀ ਬੋਲੀ ਵਿੱਚ ਖੇਤੀਬਾੜੀ ਦਾ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛੋ।',
    feature_journal_title: 'ਡਿਜੀਟਲ ਖੇਤੀ ਡਾਇਰੀ',
    feature_journal_desc: 'ਸਿੰਚਾਈ, ਸਪਰੇਅ ਅਤੇ ਖਾਦ ਦੀ ਵਰਤੋਂ ਆਪਣੀ ਡਾਇਰੀ ਵਿੱਚ ਦਰਜ ਕਰੋ।',

    // Climate View
    climate_title: '24-ਘੰਟੇ ਦਾ ਖੇਤੀਬਾੜੀ ਕਾਰਜ ਚੱਕਰ',
    climate_subtitle: 'ਸਪਰੇਅ, ਖਾਦ ਅਤੇ ਸਿੰਚਾਈ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ',
    hourly_legend_good: 'ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ',
    hourly_legend_caution: 'ਮੱਧਮ ਸਾਵਧਾਨੀ',
    hourly_legend_avoid: 'ਵੱਧ ਗਰਮੀ / ਸਪਰੇਅ ਨਾ ਕਰੋ',
    forecast_5day: 'ਅਗਲੇ 5 ਦਿਨਾਂ ਦਾ ਮੌਸਮ ਅਨੁਮਾਨ',
    what_why_when_how: 'ਖੇਤੀ ਸਲਾਹ: ਕੀ, ਕਿਉਂ, ਕਦੋਂ ਅਤੇ ਕਿਵੇਂ ਕਰੋ',

    // My Farm View
    farm_title: 'ਸਟੀਕ ਖੇਤ ਪ੍ਰਬੰਧਨ',
    field_01: 'ਖੇਤ 01 (ਕਣਕ HD-3086)',
    field_02: 'ਖੇਤ 02 (ਸਰ੍ਹੋਂ ਪੂਸਾ-ਬੋਲਡ)',
    field_03: 'ਖੇਤ 03 (ਛੋਲੇ ਦੇਸੀ)',
    soil_moisture: 'ਮਿੱਟੀ ਦੀ ਨਮੀ',
    nitrogen_level: 'ਨਾਈਟ੍ਰੋਜਨ ਪੱਧਰ',
    crop_stage: 'ਫ਼ਸਲ ਵਾਧਾ ਪੜਾਅ',
    thermal_stress: 'ਗਰਮੀ ਦਾ ਤਣਾਅ',
    irrigation_action: 'ਸਿਫ਼ਾਰਸ਼ ਕੀਤੀ ਕਾਰਵਾਈ',

    // Soil & Water Testing
    testing_title: 'ਮਿੱਟੀ ਸਿਹਤ ਅਤੇ ਸਿੰਚਾਈ ਪਾਣੀ ਦੀ ਪਰਖ',
    soil_tab: 'ਮਿੱਟੀ ਤੱਤ ਟੈਸਟਿੰਗ',
    water_tab: 'ਸਿੰਚਾਈ ਪਾਣੀ ਟੈਸਟਿੰਗ',
    reports_tab: 'ਲੈਬ ਰਿਪੋਰਟਾਂ',
    opt_apply_soil: 'ਮਿੱਟੀ ਦੀ ਪਰਖ ਲਈ ਅਰਜ਼ੀ ਦਿਓ',
    opt_apply_water: 'ਪਾਣੀ ਦੀ ਪਰਖ ਲਈ ਅਰਜ਼ੀ ਦਿਓ',
    opt_govt_soil_report: 'ਸਰਕਾਰ ਦੁਆਰਾ ਮਿੱਟੀ ਦੀ ਰਿਪੋਰਟ',
    opt_all_reports: 'ਸਾਰੀਆਂ ਰਿਪੋਰਟਾਂ ਦਾ ਡਾਟਾ',
    overall_health_score: 'ਮਿੱਟੀ ਸਿਹਤ ਸਕੋਰ',
    ph_level: 'ਪੀਐਚ (pH) ਪੱਧਰ',
    organic_carbon: 'ਜੈਵਿਕ ਕਾਰਬਨ (%)',
    nitrogen_status: 'ਉਪਲਬਧ ਨਾਈਟ੍ਰੋਜਨ (N)',
    phosphorus_status: 'ਫ਼ਾਸਫ਼ੋਰਸ (P₂O₅)',
    potassium_status: 'ਪੋਟਾਸ਼ (K₂O)',
    zinc_iron: 'ਸੂਖਮ ਤੱਤ (ਜ਼ਿੰਕ / ਆਇਰਨ)',
    ai_remedy: 'ਏਆਈ ਖਾਦ ਸੁਧਾਰ ਅਤੇ ਮਾਤਰਾ ਸਲਾਹ',

    // Disease View
    disease_title: 'ਏਆਈ ਫ਼ਸਲ ਬਿਮਾਰੀ ਜਾਂਚ ਅਤੇ ਸਕੈਨਰ',
    scan_leaf_tab: 'ਫ਼ਸਲ ਦਾ ਪੱਤਾ ਸਕੈਨ ਕਰੋ',
    known_diseases_tab: 'ਇਲਾਕਾਈ ਫ਼ਸਲੀ ਬਿਮਾਰੀਆਂ ਲਾਇਬ੍ਰੇਰੀ',
    drop_leaf_photo: 'ਬਿਮਾਰੀ ਜਾਂਚਣ ਲਈ ਪੱਤੇ ਦੀ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ ਜਾਂ ਖਿੱਚੋ',
    symptoms: 'ਬਿਮਾਰੀ ਦੇ ਲੱਛਣ',
    chemical_cure: 'ਕੈਮੀਕਲ ਉੱਲੀਨਾਸ਼ਕ / ਕੀਟਨਾਸ਼ਕ ਇਲਾਜ',
    organic_cure: 'ਜੈਵਿਕ / ਦੇਸੀ ਨੁਸਖ਼ਾ',
    preventive_steps: 'ਬਚਾਅ ਦੇ ਅਗਾਊਂ ਪ੍ਰਬੰਧ',

    // Schemes View
    schemes_title: 'ਸਰਕਾਰੀ ਖੇਤੀ ਸਕੀਮਾਂ ਅਤੇ ਸਬਸਿਡੀਆਂ',
    eligible_schemes: 'ਤੁਹਾਡੇ ਲਈ ਢੁੱਕਵੀਆਂ ਸਕੀਮਾਂ',
    subsidy_amount: 'ਸਬਸਿਡੀ ਅਤੇ ਲਾਭ',
    eligibility_criteria: 'ਯੋਗਤਾ ਸ਼ਰਤਾਂ',
    documents_needed: 'ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼',
    apply_portal: 'ਸਰਕਾਰੀ ਪੋਰਟਲ ਉੱਤੇ ਅਰਜ਼ੀ ਦਿਓ',

    // Simulator View
    simulator_title: 'ਇੰਟਰਐਕਟਿਵ ਫ਼ਸਲ ਅਤੇ ਮੌਸਮ ਸਿਮੂਲੇਟਰ',
    temp_shift: 'ਤਾਪਮਾਨ ਬਦਲਾਅ',
    rain_variation: 'ਮੀਂਹ ਵਿੱਚ ਫ਼ਰਕ',
    irrigation_system: 'ਸਿੰਚਾਈ ਢੰਗ',
    pest_risk: 'ਕੀੜੇ-ਮਕੌੜੇ ਦਾ ਖ਼ਤਰਾ',
    projected_yield: 'ਅੰਦਾਜ਼ਨ ਝਾੜ ਵਿੱਚ ਬਦਲਾਅ',
    water_needed: 'ਪਾਣੀ ਦੀ ਲੋੜ',
    profit_shift: 'ਸ਼ੁੱਧ ਮੁਨਾਫ਼ੇ ਤੇ ਅਸਰ',
    soil_health: 'ਮਿੱਟੀ ਸਿਹਤ ਇੰਡੈਕਸ',
    ai_verdict: 'ਏਆਈ ਵਿਗਿਆਨਕ ਵਿਸ਼ਲੇਸ਼ਣ',

    // Financials View
    financials_title: 'ਸੀਜ਼ਨ ਅਨੁਸਾਰ ਆਮਦਨ, ਖ਼ਰਚਾ ਅਤੇ ਮੁਨਾਫ਼ਾ ਵਿਸ਼ਲੇਸ਼ਣ',
    gross_revenue: 'ਕੁੱਲ ਆਮਦਨ (Gross Revenue)',
    total_expenses: 'ਕੁੱਲ ਖ਼ਰਚਾ (Expenses)',
    net_profit: 'ਸ਼ੁੱਧ ਬਚਤ / ਮੁਨਾਫ਼ਾ (Net Profit)',
    profit_per_acre: 'ਪ੍ਰਤੀ ਏਕੜ ਸ਼ੁੱਧ ਮੁਨਾਫ਼ਾ',
    expense_breakdown: 'ਖ਼ਰਚਿਆਂ ਦਾ ਵੇਰਵਾ (ਬੀਜ, ਖਾਦ, ਸਪਰੇਅ, ਡੀਜ਼ਲ/ਬਿਜਲੀ, ਵਾਢੀ)',
    ai_profit_tips: 'ਏਆਈ ਮੁਨਾਫ਼ਾ ਵਧਾਉਣ ਦੇ ਨੁਕਤੇ',

    // AI View
    ai_title: 'ਏਆਈ ਕਿਸਾਨ ਮਿੱਤਰ ਅਤੇ ਖੇਤੀ ਮਾਹਿਰ',
    ai_desc: 'ਫ਼ਸਲ ਦੇ ਕੀੜਿਆਂ, ਖਾਦ ਦੀ ਵਰਤੋਂ, ਮੌਸਮ ਤੋਂ ਬਚਾਅ ਬਾਰੇ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛੋ।',
    ask_ai_placeholder: 'ਆਪਣਾ ਖੇਤੀ ਸਵਾਲ ਲਿਖੋ (ਜਿਵੇਂ: ਕਣਕ ਵਿੱਚ ਗਰਮੀ ਤੋਂ ਬਚਾਅ ਕਿਵੇਂ ਕਰੀਏ?)',
    send: 'ਪੁੱਛੋ',
    listening: 'ਤੁਹਾਡੀ ਆਵਾਜ਼ ਸੁਣੀ ਜਾ ਰਹੀ ਹੈ...',
    memory_title: 'ਖੇਤ ਦਾ ਪਿਛਲਾ ਇਤਿਹਾਸ ਅਤੇ ਸਿੱਖੀਆਂ ਗੱਲਾਂ',

    // Journal View
    journal_title: 'ਡਿਜੀਟਲ ਕਿਸਾਨ ਡਾਇਰੀ ਅਤੇ ਫ਼ੀਲਡ ਲੌਗ',
    write_entry: '+ ਡਾਇਰੀ ਵਿੱਚ ਨਵਾਂ ਨੋਟ ਲਿਖੋ',
    entry_title: 'ਕੰਮ ਦਾ ਸਿਰਲੇਖ',
    entry_type: 'ਕੰਮ ਦੀ ਕਿਸਮ',
    target_field: 'ਸੰਬੰਧਿਤ ਖੇਤ',
    field_notes: 'ਖੇਤ ਦੇ ਮੁੱਖ ਨੋਟਸ ਅਤੇ ਨਿਰੀਖਣ',
    attach_photo: 'ਖੇਤ ਦੀ ਫੋਟੋ ਜੋੜੋ',
    observed_stress: 'ਫ਼ਸਲ ਉੱਤੇ ਅਸਰ ਫੀਡਬੈਕ',
    action_result: 'ਕੀਤੇ ਗਏ ਕੰਮ ਦਾ ਨਤੀਜਾ'
  }
};

export type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'hi', // Defaulting to Hindi as requested!
  setLanguage: () => {},
  t: (key: TranslationKey) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode; initialLanguage?: Language }> = ({
  children,
  initialLanguage = 'hi',
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language') as Language;
    if (saved && (saved === 'en' || saved === 'hi' || saved === 'pa')) {
      return saved;
    }
    return initialLanguage;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language', lang);
  };

  const t = (key: TranslationKey): string => {
    const langDict = translations[language] || translations.hi || translations.en;
    return (langDict as Record<string, string>)[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
