// ─── Total Home Appliance Repair — network data ─────────────────────────────
// Real business facts only. No prices, hours, addresses, ratings, review
// counts, technician counts or guarantees are stated anywhere in this app.

export const PHONE_DISPLAY = '954-931-7997'
export const PHONE_TEL = 'tel:+19549317997'
export const PHONE_SMS = 'sms:+19549317997'
export const EMAIL = 'service@topspeedappliance.net'
export const SERVICE_OS_URL = 'https://topspeedserviceos.com'
export const SERVICE_OS_BOOK_URL = 'https://topspeedserviceos.com/book'
export const SERVICE_OS_SPEEDY_URL = 'https://topspeedserviceos.com/speedy'
export const SERVICE_OS_TRACK_URL = 'https://topspeedserviceos.com/track'
export const SERVICE_OS_SIGNIN_URL = 'https://topspeedserviceos.com/app'
export const SERVICE_OS_RESET_URL = 'https://topspeedserviceos.com/reset-password'

export interface Service {
  id: string
  name: string
  icon: string
  tagline: string
  problems: string[]
  checks: string[]
}

export const SERVICES: Service[] = [
  {
    id: 'refrigerator',
    name: 'Refrigerator Repair',
    icon: 'fridge',
    tagline: 'Not cooling, leaking, noisy or cycling wrong — we find out why.',
    problems: [
      'Not cooling or not cold enough',
      'Freezer cold but fridge warm',
      'Water leaking on the floor or inside',
      'Running constantly or loud buzzing/clicking',
      'Ice or frost building up inside',
      'Door not sealing — warm air getting in',
    ],
    checks: [
      'Condenser and evaporator coils and fans',
      'Compressor start relay and run behavior',
      'Thermostat, sensors and control board signals',
      'Door gaskets and hinge alignment',
      'Defrost system — heater, timer/board and drain',
      'Refrigerant circuit signs (sealed-system issues are flagged honestly, never guessed at)',
    ],
  },
  {
    id: 'washer',
    name: 'Washer Repair',
    icon: 'washer',
    tagline: 'Won’t drain, spin, fill or start — front-load and top-load.',
    problems: [
      'Won’t drain or leaves water in the tub',
      'Won’t spin or agitate',
      'Leaking from the front, back or underneath',
      'Loud banging or walking across the floor',
      'Stops mid-cycle or shows an error code',
      'Won’t fill, or fills too slowly',
    ],
    checks: [
      'Drain pump, hoses and coin trap for blockages',
      'Drive belt, motor and coupling (model dependent)',
      'Lid switch / door lock and control inputs',
      'Water inlet valves and pressure switch',
      'Suspension rods / shocks and tub balance',
      'Error-code history where the model stores it',
    ],
  },
  {
    id: 'dryer',
    name: 'Dryer Repair',
    icon: 'dryer',
    tagline: 'No heat, no tumble, or loads that take forever to dry.',
    problems: [
      'Runs but produces no heat',
      'Drum won’t tumble',
      'Takes two or more cycles to dry',
      'Squealing, thumping or grinding noises',
      'Shuts off after a few minutes',
      'Won’t start at all',
    ],
    checks: [
      'Heating element / gas ignition components (safety-checked)',
      'Thermal fuse, thermostats and cycling sensors',
      'Belt, idler pulley and drum rollers',
      'Motor and blower wheel',
      'Airflow through the vent run — a clogged vent mimics dryer failure',
      'Door switch and start circuit',
    ],
  },
  {
    id: 'oven-range',
    name: 'Oven & Range Repair',
    icon: 'oven',
    tagline: 'Burners that won’t light and ovens that won’t hold temperature.',
    problems: [
      'Oven won’t heat or heats unevenly',
      'Burner won’t ignite or keeps clicking',
      'Temperature is off — food under/overcooks',
      'Error codes on the display',
      'Door won’t close or latch for self-clean',
      'Gas smell near a burner (treat as urgent — see safety note)',
    ],
    checks: [
      'Bake and broil elements (electric) for continuity',
      'Igniter strength and gas valve response (gas models)',
      'Temperature sensor and control board calibration',
      'Burner caps, spark module and switches',
      'Door hinges, latch and gasket seal',
      'Wiring and terminal block condition',
    ],
  },
  {
    id: 'dishwasher',
    name: 'Dishwasher Repair',
    icon: 'dishwasher',
    tagline: 'Dishes still dirty, water left standing, or leaks at the door.',
    problems: [
      'Not cleaning — film or food left on dishes',
      'Water standing in the bottom after a cycle',
      'Leaking from the door or underneath',
      'Won’t start or stops mid-cycle',
      'Loud grinding or humming',
      'Detergent cup not opening',
    ],
    checks: [
      'Spray arms and filters for clogs and wear',
      'Drain pump, drain hose and air gap',
      'Water inlet valve and float switch',
      'Door latch, gasket and hinge springs',
      'Wash motor / circulation pump performance',
      'Heating element and drying cycle components',
    ],
  },
  {
    id: 'freezer-ice-maker',
    name: 'Freezer & Ice Maker Repair',
    icon: 'freezer',
    tagline: 'Soft ice cream, no ice, or a freezer that can’t stay frozen.',
    problems: [
      'Freezer not staying at temperature',
      'Ice maker stopped producing ice',
      'Ice tastes or smells off',
      'Frost buildup on walls and food',
      'Water dispenser slow or stopped',
      'Clicking or humming without starting',
    ],
    checks: [
      'Evaporator fan and coil frost pattern',
      'Defrost heater, thermostat and drain line',
      'Ice maker module, fill valve and water line pressure',
      'Filter condition and dispenser switches',
      'Compressor start components',
      'Door gasket seal and alignment',
    ],
  },
  {
    id: 'microwave',
    name: 'Microwave Repair',
    icon: 'microwave',
    tagline: 'Not heating, sparking, or a turntable that quit turning.',
    problems: [
      'Runs but food stays cold',
      'Sparking or arcing inside',
      'Turntable not rotating',
      'Keypad or display not responding',
      'Door won’t latch — unit won’t start',
      'Loud buzzing while running',
    ],
    checks: [
      'Door switches and latch alignment (safety interlocks first)',
      'High-voltage components — handled with discharge safety procedure',
      'Turntable motor and roller ring',
      'Control board and keypad response',
      'Waveguide cover condition (a common sparking cause)',
      'Interior light, fan and venting behavior',
    ],
  },
  {
    id: 'cooktop',
    name: 'Cooktop Repair',
    icon: 'cooktop',
    tagline: 'Dead burners, cracked glass, or elements stuck on high.',
    problems: [
      'One or more burners not heating',
      'Element stuck on high or won’t regulate',
      'Cracked or damaged glass top',
      'Burner igniter clicking nonstop (gas)',
      'Indicator lights out or controls unresponsive',
      'Uneven heating across the burner',
    ],
    checks: [
      'Surface elements / radiant elements for continuity',
      'Infinite switches and control inputs',
      'Gas burner valves, caps and spark igniters',
      'Wiring harness and terminal connections',
      'Glass top condition and safe replacement options',
      'Control board signals where fitted',
    ],
  },
  {
    id: 'garbage-disposal',
    name: 'Garbage Disposal Repair',
    icon: 'disposal',
    tagline: 'Humming, jammed, leaking or completely dead disposals.',
    problems: [
      'Hums but doesn’t grind',
      'Completely dead — no sound at all',
      'Leaking from the bottom or side',
      'Frequent clogs or slow draining',
      'Bad odors that won’t clear',
      'Trips the reset button repeatedly',
    ],
    checks: [
      'Flywheel jam — cleared safely with power isolated',
      'Reset button, wall switch and power supply',
      'Motor condition (a humming, hot motor usually means replacement)',
      'Splash guard, flange and mounting seals for leak source',
      'Drain line and dishwasher inlet connection',
      'Honest repair-vs-replace call — small units are often cheaper to replace',
    ],
  },
  {
    id: 'wine-cooler',
    name: 'Wine Cooler Repair',
    icon: 'wine',
    tagline: 'Temperature drift puts a collection at risk — we stabilize it.',
    problems: [
      'Temperature drifting above the set point',
      'Running constantly or short-cycling',
      'Condensation inside the cabinet',
      'Unusual vibration or noise',
      'Display or controls not responding',
      'Door not sealing — cold air escaping',
    ],
    checks: [
      'Thermostat / electronic control accuracy against a reference thermometer',
      'Compressor and condenser fan operation',
      'Evaporator coil and defrost behavior',
      'Door gasket and hinge alignment',
      'Ventilation clearance around the unit (a frequent hidden cause)',
      'Refrigerant circuit signs, flagged honestly if sealed-system work is needed',
    ],
  },
]

export interface City {
  id: string
  name: string
  core: boolean
  blurb: string
}

export const CITIES: City[] = [
  { id: 'coral-springs', name: 'Coral Springs', core: true, blurb: 'A core network city — full service fleet coverage for every appliance we repair.' },
  { id: 'sunrise', name: 'Sunrise', core: true, blurb: 'A core network city — full service fleet coverage for every appliance we repair.' },
  { id: 'plantation', name: 'Plantation', core: true, blurb: 'A core network city — full service fleet coverage for every appliance we repair.' },
  { id: 'fort-lauderdale', name: 'Fort Lauderdale', core: true, blurb: 'A core network city — full service fleet coverage for every appliance we repair.' },
  { id: 'coconut-creek', name: 'Coconut Creek', core: false, blurb: 'Part of the wider Broward network — every repair service routes through the same Service OS setters.' },
  { id: 'pompano-beach', name: 'Pompano Beach', core: false, blurb: 'Part of the wider Broward network — every repair service routes through the same Service OS setters.' },
  { id: 'deerfield-beach', name: 'Deerfield Beach', core: false, blurb: 'Part of the wider Broward network — every repair service routes through the same Service OS setters.' },
  { id: 'margate', name: 'Margate', core: false, blurb: 'Part of the wider Broward network — every repair service routes through the same Service OS setters.' },
  { id: 'tamarac', name: 'Tamarac', core: false, blurb: 'Part of the wider Broward network — every repair service routes through the same Service OS setters.' },
  { id: 'davie', name: 'Davie', core: false, blurb: 'Part of the wider Broward network — every repair service routes through the same Service OS setters.' },
  { id: 'weston', name: 'Weston', core: false, blurb: 'Part of the wider Broward network — every repair service routes through the same Service OS setters.' },
  { id: 'parkland', name: 'Parkland', core: false, blurb: 'Part of the wider Broward network — every repair service routes through the same Service OS setters.' },
  { id: 'lauderhill', name: 'Lauderhill', core: false, blurb: 'Part of the wider Broward network — every repair service routes through the same Service OS setters.' },
  { id: 'hollywood', name: 'Hollywood', core: false, blurb: 'Part of the wider Broward network — every repair service routes through the same Service OS setters.' },
  { id: 'pembroke-pines', name: 'Pembroke Pines', core: false, blurb: 'Part of the wider Broward network — every repair service routes through the same Service OS setters.' },
  { id: 'miramar', name: 'Miramar', core: false, blurb: 'Part of the wider Broward network — every repair service routes through the same Service OS setters.' },
]

export interface SisterBrand {
  name: string
  role: string
  url: string
  note: string
}

export const SISTER_BRANDS: SisterBrand[] = [
  {
    name: 'Top Speed Appliance / Service OS',
    role: 'The operating system of the network',
    url: 'https://topspeedserviceos.com',
    note: 'Every booking is submitted, confirmed by Service Setters and tracked here.',
  },
  {
    name: 'Appliance Connect',
    role: 'Customer portal with Speedy',
    url: 'https://appliance-connect.vercel.app',
    note: 'The customer-facing portal for Top Speed Appliance customers.',
  },
  {
    name: 'Clean Out Vents',
    role: 'Dryer vent cleaning',
    url: 'https://cleanoutvents.com',
    note: 'The network’s dryer vent cleaning brand for Broward homes, condos and HOAs.',
  },
  {
    name: 'Appliance Express',
    role: 'Appliance sales & sourcing',
    url: 'https://appliance-express.vercel.app',
    note: 'When repair stops making sense, Express sources the replacement.',
  },
  {
    name: 'Appliance Plus',
    role: 'Parts supply with PLUS AI',
    url: 'https://applianceplus.vercel.app',
    note: 'Parts matched by model and symptom for techs and DIY repairs.',
  },
  {
    name: 'Gateway Express',
    role: 'The ecosystem hub',
    url: 'https://gateway-express-one.vercel.app',
    note: 'The umbrella platform over every Top Speed brand.',
  },
]

// ─── Symptom guide — written reference content ──────────────────────────────
// Plain written guidance maintained by the network: likely causes are
// possibilities only, never a diagnosis. This is NOT Speedy — Speedy is the
// real AI assistant at Top Speed Service OS (see the Speedy screen).
// Safety warnings come first.

export interface GuideRule {
  appliance: string
  symptom: string
  causes: string[]
  safety: string | null
  prep: string[]
}

export const GUIDE_RULES: GuideRule[] = [
  {
    appliance: 'Refrigerator',
    symptom: 'Not cooling',
    causes: [
      'Dirty condenser coils restricting heat release',
      'A failed condenser or evaporator fan motor',
      'A weak compressor start relay',
      'A door gasket leaking cold air',
      'In more serious cases, a sealed-system (refrigerant) problem',
    ],
    safety: 'Refrigerant work requires certified handling. If the fridge is warm and the compressor is silent or clicking repeatedly, unplug it and book a technician rather than opening any panels.',
    prep: ['Note the temperatures in both compartments if you can', 'Check the doors close fully and nothing blocks the vents inside', 'Write down the model number from the label inside the fridge wall'],
  },
  {
    appliance: 'Refrigerator',
    symptom: 'Leaking water',
    causes: [
      'A clogged or frozen defrost drain',
      'A cracked drain pan',
      'A water inlet valve or filter housing leak (if it has a dispenser/ice maker)',
      'A door gasket issue causing condensation runoff',
    ],
    safety: 'Water near electrical outlets is a hazard — keep the area dry and unplug the fridge if water reaches an outlet or power cord.',
    prep: ['Mop up standing water and place a towel at the base', 'Note whether the water is clear or has an odor', 'Check whether the leak follows ice-maker or dispenser use'],
  },
  {
    appliance: 'Washer',
    symptom: "Won't drain",
    causes: [
      'A clogged drain pump filter or coin trap (very common)',
      'A kinked or blocked drain hose',
      'A failed drain pump',
      'A lid switch / door lock fault telling the control it is unsafe to drain',
    ],
    safety: null,
    prep: ['Turn the washer off and unplug it before opening any filter', 'Have towels and a shallow pan ready — trapped water will come out', 'Fish out any visible items from pockets in the drum'],
  },
  {
    appliance: 'Washer',
    symptom: 'Leaking',
    causes: [
      'A worn door boot seal (front-load) or tub seal',
      'Loose or split inlet/drain hoses',
      'Too much detergent causing overflow of suds',
      'A cracked drain pump housing',
    ],
    safety: 'Turn off the water supply valves behind the washer right away to limit damage, and unplug the machine if water is pooling near the cord.',
    prep: ['Note where the water appears — front, back or underneath', 'Check whether it leaks during fill, wash or drain', 'Photograph the hoses and connections if you can do so safely'],
  },
  {
    appliance: 'Dryer',
    symptom: 'No heat',
    causes: [
      'A blown thermal fuse (often caused by restricted vent airflow)',
      'A failed heating element (electric) or igniter/gas valve coils (gas)',
      'A cycling thermostat fault',
      'A clogged vent run overheating the machine until safeties trip',
    ],
    safety: 'Gas dryers: if you smell gas, stop — leave the area, do not touch switches, and call your gas utility or 911 from outside. Never open a gas dryer’s burner compartment yourself.',
    prep: ['Clean the lint trap and check the outside vent flap opens while it runs', 'Confirm the dryer is not set to air-fluff / no-heat', 'Note whether the drum still tumbles normally'],
  },
  {
    appliance: 'Dryer',
    symptom: 'Takes too long to dry',
    causes: [
      'A clogged or crushed vent run — the most common cause',
      'A lint-packed blower housing',
      'A weakening heating element cycling off early',
      'Overloading beyond what the airflow can handle',
    ],
    safety: null,
    prep: ['Feel for airflow at the outside vent cap while the dryer runs on heat', 'Clean the lint trap and wash it if fabric-softener film has built up', 'The network’s Clean Out Vents brand handles full vent-run cleaning if airflow is the problem'],
  },
  {
    appliance: 'Oven & Range',
    symptom: "Won't heat",
    causes: [
      'A failed bake element (electric) — often visibly blistered or broken',
      'A weak igniter (gas) that glows but never opens the gas valve',
      'A failed temperature sensor throwing the control off',
      'A control board or relay fault',
    ],
    safety: 'Gas models: a strong gas smell means leave the home and call your gas utility or 911 from outside — do not relight anything or flip switches. Electrical models: never reach into a live oven compartment; unplug or switch off the breaker first.',
    prep: ['Note whether broil works even if bake does not (a useful clue)', 'Write down any error code shown on the display', 'Record the model number from the frame behind the door or drawer'],
  },
  {
    appliance: 'Oven & Range',
    symptom: 'Burner won’t ignite / keeps clicking',
    causes: [
      'A clogged burner cap or port (food boil-over is the usual culprit)',
      'A wet igniter after cleaning — clicking often stops once fully dry',
      'A failed spark module or burner switch',
      'A misaligned burner cap after removal',
    ],
    safety: 'If a burner clicks for more than a few seconds without lighting, turn it off — unburned gas is accumulating. If you smell gas strongly, leave and call your gas utility or 911 from outside.',
    prep: ['Make sure burner caps are seated flat and centered', 'Let a recently cleaned burner dry completely before retrying', 'Note which burner is affected and whether others light normally'],
  },
  {
    appliance: 'Dishwasher',
    symptom: 'Not cleaning well',
    causes: [
      'Clogged spray arm holes or a loaded filter',
      'Low water temperature reaching the machine',
      'A weak circulation pump',
      'Hard-water buildup on the interior and arms',
    ],
    safety: null,
    prep: ['Clean the filter at the bottom of the tub', 'Check spray arms spin freely by hand', 'Run the hot tap at the sink before starting a cycle so the fill starts hot'],
  },
  {
    appliance: 'Dishwasher',
    symptom: 'Water standing in the bottom',
    causes: [
      'A clogged filter or drain hose',
      'A blocked air gap or garbage disposal inlet plug (common after a new disposal install)',
      'A failed drain pump',
      'A kinked drain line under the sink',
    ],
    safety: 'Standing water plus a humming sound can mean a stalled pump motor — stop the cycle and switch the dishwasher off at the breaker if it gets hot or smells electrical.',
    prep: ['Scoop out standing water and clean the filter', 'If a disposal was recently installed, tell the setter — the knockout plug is a classic cause', 'Note whether the unit drains at all or never starts'],
  },
  {
    appliance: 'Microwave',
    symptom: 'Not heating',
    causes: [
      'A failed door switch making the control think the door is open',
      'A failed magnetron or high-voltage component',
      'A control board fault',
    ],
    safety: 'Microwaves store lethal voltage in the high-voltage capacitor even when unplugged. Never open the cabinet yourself — this is technician-only territory, no exceptions.',
    prep: ['Confirm the unit runs (light, fan, turntable) even though food stays cold', 'Try a different outlet to rule out a power issue', 'Write down the model number from the door frame label'],
  },
  {
    appliance: 'Microwave',
    symptom: 'Sparking inside',
    causes: [
      'A damaged waveguide (mica) cover — the most common cause',
      'Metal left in food packaging or a damaged rack',
      'Chipped interior paint exposing metal',
    ],
    safety: 'Stop the microwave immediately and unplug it. Do not run it again until it has been inspected — repeated arcing damages the magnetron and is a fire risk.',
    prep: ['Remove any metal or foil-lined packaging', 'Note where the sparking appears (side wall cover is typical)', 'Do not attempt to clean or remove the waveguide cover yourself if it is burnt'],
  },
  {
    appliance: 'Garbage Disposal',
    symptom: 'Hums but won’t grind',
    causes: [
      'A jammed flywheel — a bone, bottle cap or utensil is the usual cause',
      'A worn motor that can no longer start under load',
    ],
    safety: 'Never put your hand inside a disposal — ever. Power off at the switch and breaker before any jam-clearing attempt with the hex key underneath, and if the motor hums and gets hot, stop and book a technician.',
    prep: ['Switch it off and check with a flashlight (not fingers) for a visible obstruction', 'Try the red reset button on the bottom once, after the jam check', 'Note whether the sink drains freely around the disposal'],
  },
  {
    appliance: 'Freezer & Ice Maker',
    symptom: 'No ice',
    causes: [
      'A frozen fill tube or low water pressure to the valve',
      'A failed inlet valve or ice maker module',
      'A freezer running too warm to cycle the maker',
      'A clogged water filter starving the supply',
    ],
    safety: null,
    prep: ['Check the freezer temperature — ice makers need it near 0°F to cycle', 'Confirm the maker’s arm/switch is in the on position', 'Note when the water filter was last changed'],
  },
]

export const GUIDE_APPLIANCES = [...new Set(GUIDE_RULES.map((r) => r.appliance))]

// ─── Job tracking stages (production) ──────────────────────────────────────
// Real job tracking lives in Top Speed Service OS and the Appliance Connect
// portal. This page shows the stages a confirmed job moves through and hands
// the customer off to those systems — it does not hold job records itself.

export const TRACKING_STAGES = ['Request received', 'Setter confirmed', 'Technician assigned', 'On the way', 'Repair in progress', 'Done']

// ─── Network stats (production — counters reset to zero at launch) ────────

export const NETWORK_STATS = {
  leadsByPage: [
    { page: 'Refrigerator Repair (service page)', leads: 0 },
    { page: 'Fort Lauderdale (city page)', leads: 0 },
    { page: 'Dryer Repair (service page)', leads: 0 },
    { page: 'Coral Springs (city page)', leads: 0 },
    { page: 'Washer Repair (service page)', leads: 0 },
    { page: 'Network Hub (home)', leads: 0 },
  ],
  note: 'Production counters — reset to zero at the production launch on November 17, 2026. Bookings themselves are recorded in Top Speed Service OS.',
}
