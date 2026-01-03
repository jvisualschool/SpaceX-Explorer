// SpaceX Mission Patches from ElonX.net
// Source: https://www.elonx.net/spacex-mission-patches/

const BASE_URL = 'https://www.elonx.net/wp-content/uploads';

// 미션 이름과 패치 이미지 파일명 매핑
const PATCH_MAPPING = {
  // Starship
  'Starship Test Flight 7': 'IFT-7.png',
  'Starship Test Flight 6': 'IFT-6.jpg',
  'Starship Test Flight 5': 'IFT-5.jpeg',
  'Starship Test Flight 4': 'IFT-4.jpeg',
  'Starship Test Flight 3': 'IFT-3.jpeg',
  'Starship Test Flight 2': 'Starship_Test_Flight_2.jpg',
  'Starship Test Flight': 'Starship_Test_Flight.png',
  'IFT-7': 'IFT-7.png',
  'IFT-6': 'IFT-6.jpg',
  'IFT-5': 'IFT-5.jpeg',
  'IFT-4': 'IFT-4.jpeg',
  'IFT-3': 'IFT-3.jpeg',
  'IFT-2': 'Starship_Test_Flight_2.jpg',
  'IFT-1': 'Starship_Test_Flight.png',

  // 2025 Missions
  'MTG-S1': 'MTG_S1.png',
  'Ax-4': 'Ax-4.png',
  'SXM-10': 'SXM-10.png',
  'GPSIII-SV08': 'GPSIII-SV08.png',
  'GPS III SV08': 'GPSIII-SV08.png',
  'Fram2': 'Fram2.png',
  'NROL-69': 'NROL-69.png',
  'NROL-77': 'NROL-77.png',
  'Crew-10': 'Crew-10.png',
  'SPHEREx': 'SPHEREx.png',
  'SPHEREx / PUNCH': 'SPHEREx.png',
  'PUNCH': 'SPHEREx.png',
  'IM-2': 'IM-2.png',
  'SpainSat-NG I': 'Spain_Sat_Ng1.png',
  'SpainSat NG I': 'Spain_Sat_Ng1.png',
  'Thuraya 4-NGS': 'Thuraya_4.png',
  'Thuraya 4': 'Thuraya_4.png',
  'Bandwagon-2': 'Bandwagon-2.png',

  // 2024 Missions
  'Astranis Block 2': 'Astranis-2.png',
  'RRT-1': 'RRT_1.png',
  'GPSIII-SV07': 'RRT_1.png',
  'GPS III SV07': 'RRT_1.png',
  'SXM-9': 'SXM_9.png',
  'GSAT-N2': 'GSAT-N2.png',
  'CRS-31': 'CRS-31.png',
  'SpX-31': 'CRS-31.png',
  'Europa Clipper': 'Europa_Clipper.png',
  'Hera': 'Hera.png',
  'Crew-9': 'Crew_9.png',
  'Polaris Dawn': 'Polaris_Dawn.png',
  'WorldView Legion 2': 'WorldViewLegion2.png',
  'ASBM': 'ASBM.png',
  'Cygnus NG-21': 'Cygnus_NG_21.png',
  'NG-21': 'Cygnus_NG_21.png',
  'GOES-U': 'GOES_U.png',
  'EarthCARE': 'EarthCARE.png',
  'USSF-62': 'USSF_62.png',
  'Bandwagon-1': 'Bandwagon-1.png',
  'Eutelsat 36D': 'Eutelsat_36_D.png',
  'CRS-30': 'CRS-30.png',
  'SpX-30': 'CRS-30.png',
  'Crew-8': 'CREW_8.png',

  // 2023 Missions
  'USSF-52': 'USSF_52.png',
  'Korea 425': 'Project_425_.png',
  'Project 425': 'Project_425_.png',
  'Psyche': 'psyche.jpg',
  'CRS-29': 'CRS_29.png',
  'SpX-29': 'CRS_29.png',
  'SDA Tranche 0 L2': 'SDA_0_B.png',
  'Crew-7': 'Crew_7_SpaceX.png',
  'Intelsat Galaxy 37': 'Intelsat_G_37.png',
  'Jupiter-3': 'Jupiter_3.png',
  'EchoStar 24': 'Jupiter_3.png',
  'Euclid': 'EUCLID.png',
  'Satria': 'Satria.png',
  'CRS-28': 'CRS_28.png',
  'SpX-28': 'CRS_28.png',
  'BADR-8': 'Arabsat_Badr_8.png',
  'Arabsat 7B': 'Arabsat_Badr_8.png',
  'Ax-2': 'AX_2.png',
  'Axiom-2': 'AX_2.png',
  'Iridium-9': 'Iridium_Oneweb.png',
  'OneWeb F19': 'Iridium_Oneweb.png',
  'Viasat-3 Americas': 'Via_Sat_3_Americas_6f49235d57.png',
  'Viasat-3': 'Via_Sat_3_Americas_6f49235d57.png',
  'Intelsat 40e': 'Intelsat_40e.png',
  'SDA Tranche 0 L1': 'SDA_T0_L1.png',
  'SES-18': 'SES_18_19.png',
  'SES-19': 'SES_18_19.png',
  'SES-18/SES-19': 'SES_18_19.png',
  'CRS-27': 'CRS_27.png',
  'SpX-27': 'CRS_27.png',
  'OneWeb F17': 'OneWeb_F17.png',
  'Crew-6': 'NASA_CREW_6_ce15102c61.png',
  'Inmarsat-6 F2': 'Inmarsat_6_F2.png',
  'Amazonas Nexus': '128-Amazonas-Nexus.png',
  'USSF-67': 'USSF_67.png',

  // 2022 Missions
  'O3b mPOWER': 'O3b_mPOWER_1.png',
  'SWOT': 'SWOT.png',
  'OneWeb F15': 'OneWeb_F15.png',
  'CRS-26': 'CRS-26.png',
  'SpX-26': 'CRS-26.png',
  'Eutelsat 10B': 'Eutelsat_10B.png',
  'Intelsat Galaxy 31/32': 'Intelsat_G-31_G-32.png',
  'Galaxy 31': 'Intelsat_G-31_G-32.png',
  'Galaxy 32': 'Intelsat_G-31_G-32.png',
  'Eutelsat Hotbird 13G': 'Hotbird_13G.png',
  'Hotbird 13G': 'Hotbird_13G.png',
  'USSF-44': 'USSF-44.png',
  'Eutelsat Hotbird 13F': 'Hotbird_13F.png',
  'Hotbird 13F': 'Hotbird_13F.png',
  'Intelsat Galaxy 33/34': 'Intelsat_G33-34.png',
  'Galaxy 33': 'Intelsat_G33-34.png',
  'Galaxy 34': 'Intelsat_G33-34.png',
  'Crew-5': 'Crew-5_SpaceX.png',
  'KPLO': 'KPLO.png',
  'Danuri': 'KPLO.png',
  'CRS-25': 'CRS-25.png',
  'SpX-25': 'CRS-25.png',
  'SES-22': 'SES-22.png',
  'Globalstar FM15': 'GlobalstarFM15.png',
  'SARah-1': 'SARah1.png',
  'Nilesat-301': 'Nilesat_301.png',
  'Crew-4': 'Crew-4_SpaceX.png',
  'NROL-85': 'NROL-85_SpaceX.png',
  'Axiom-1': 'Ax-1_patch.png',
  'Ax-1': 'Ax-1_patch.png',
  'NROL-87': 'NROL_87.png',
  'CSG-2': 'CSG-2.png',
  'CRS-24': 'SpaceX_CRS-24_Patch.png',
  'SpX-24': 'SpaceX_CRS-24_Patch.png',

  // 2021 Missions
  'Türksat 5B': 'TurkSat5B.png',
  'Turksat 5B': 'TurkSat5B.png',
  'IXPE': 'IXPE.png',
  'DART': 'DART_PATCH.png',
  'Crew-3': 'crew03.png',
  'Inspiration4': 'inspiration4_spacex.png',
  'CRS-23': 'CRS23_final.png',
  'SpX-23': 'CRS23_final.png',
  'GPSIII-SV05': 'GPS_III_5.png',
  'GPS III SV05': 'GPS_III_5.png',
  'SXM-8': 'SiriusXM8_final.png',
  'CRS-22': 'CRS-22-FINAL.png',
  'SpX-22': 'CRS-22-FINAL.png',
  'Crew-2': 'CREW_02_simplified.png',
  'Transporter-1': 'Transporter-1.png',
  'Transporter': 'Transporter-1.png',
  'Türksat 5A': 'TurkSat5A.png',
  'Turksat 5A': 'TurkSat5A.png',

  // 2020 Missions
  'NROL-108': 'NROL_108_final.png',
  'SXM-7': 'SiriusXM7-FINAL.png',
  'CRS-21': 'crs21_final.png',
  'SpX-21': 'crs21_final.png',
  'Sentinel-6A': 'Sentinel-6A_SpaceX.png',
  'Sentinel-6': 'Sentinel-6A_SpaceX.png',
  'Crew-1': 'crew_1_SpaceX.png',
  'GPSIII-SV04': 'GPSIII-SV04.png',
  'GPS III SV04': 'GPSIII-SV04.png',
  'SAOCOM 1B': 'SAOCOM_1B.png',
  'ANASIS-II': 'ANASIS-II_graphic.png',
  'GPSIII-SV03': 'GPSIII-3_SpaceX.png',
  'GPS III SV03': 'GPSIII-3_SpaceX.png',
  'DM-2': 'DM-2.png',
  'Crew Dragon DM-2': 'DM-2.png',
  'Demo-2': 'DM-2.png',
  'CRS-20': 'CRS-20_new.png',
  'SpX-20': 'CRS-20_new.png',
  'In-Flight Abort Test': 'IFA-1.png',
  'IFA': 'IFA-1.png',

  // 2019 Missions
  'JCSAT-18': 'JCSAT-18.png',
  'Kacific-1': 'JCSAT-18.png',
  'CRS-19': 'CRS-19_new.png',
  'SpX-19': 'CRS-19_new.png',
  'Amos-17': 'Amos-17.png',
  'CRS-18': 'CRS18-MissionPatch.png',
  'SpX-18': 'CRS18-MissionPatch.png',
  'STP-2': 'STP-2.png',
  'RADARSAT': 'radarsat.png',
  'RADARSAT Constellation': 'radarsat.png',
  'CRS-17': 'CRS-17.png',
  'SpX-17': 'CRS-17.png',
  'Arabsat 6A': 'Arabsat-6A.png',
  'DM-1': 'DM-1.png',
  'Demo-1': 'DM-1.png',
  'Crew Dragon DM-1': 'DM-1.png',
  'Nusantara Satu': 'NusantaraSatu.png',
  'Iridium-8': 'Iridium-8_NEXT.png',
  'GPSIII-SV01': 'GPS_III.png',
  'GPS III SV01': 'GPS_III.png',
  'CRS-16': 'CRS-16.png',
  'SpX-16': 'CRS-16.png',
  'SSO-A': 'SSO-A.png',
  'Es\'hail-2': 'Eshail-2.png',
  'Eshail-2': 'Eshail-2.png',

  // 2018 Missions
  'SAOCOM 1A': 'SAOCOM_1A.png',
  'Telstar 18V': 'Telstar_18V.png',
  'Merah Putih': 'MerahPutih.png',
  'Telkom-4': 'MerahPutih.png',
  'Iridium-7': 'Iridium-7.png',
  'Telstar 19V': 'Telstar-19-VANTAGE.png',
  'CRS-15': 'CRS-15.png',
  'SpX-15': 'CRS-15.png',
  'SES-12': 'SES-12.png',
  'Iridium-6': 'Iridium6_Grace.png',
  'GRACE-FO': 'Iridium6_Grace.png',
  'Bangabandhu-1': 'Bangabandhu-1.png',
  'TESS': 'TESS.png',
  'CRS-14': 'CRS-14.png',
  'SpX-14': 'CRS-14.png',
  'Iridium-5': 'Iridium-5.png',
  'Hispasat 30W-6': 'Hispasat.png',
  'Paz': 'PAZ.png',
  'Falcon Heavy Demo': 'FH-Demo.png',
  'Falcon Heavy Test': 'FH-Demo.png',
  'GovSat-1': 'GovSat.png',
  'SES-16': 'GovSat.png',

  // 2017 Missions
  'Zuma': 'Zuma.png',
  'Iridium-4': 'Iridium-4.png',
  'CRS-13': 'CRS-13.png',
  'SpX-13': 'CRS-13.png',
  'KoreaSat 5A': 'koreasat5A.png',
  'SES-11': 'SES-11_EchoStar105.png',
  'EchoStar 105': 'SES-11_EchoStar105.png',
  'Iridium-3': 'Iridium-3.png',
  'OTV-5': 'OTV-5.png',
  'X-37B': 'OTV-5.png',
  'Formosat-5': 'Formosat5.png',
  'CRS-12': 'CRS-12.png',
  'SpX-12': 'CRS-12.png',
  'Intelsat 35e': 'Intelsat-35e.png',
  'Iridium-2': 'Iridium-2.png',
  'BulgariaSat-1': 'BulgariaSat-1.png',
  'CRS-11': 'CRS-11.png',
  'SpX-11': 'CRS-11.png',
  'Inmarsat 5 F-4': 'Inmarsat-5_F4.png',
  'Inmarsat-5 F4': 'Inmarsat-5_F4.png',
  'NROL-76': 'NROL-76.png',
  'SES-10': 'SES-10.png',
  'EchoStar 23': 'Echostar-23.png',
  'CRS-10': 'CRS-10.png',
  'SpX-10': 'CRS-10.png',
  'Iridium-1': 'Iridium-1-SpaceX.png',

  // Starlink Generic (for Starlink Group missions)
  'Starlink': 'Starlink.png',

  // Transporter missions
  'Transporter (Year 4)': 'transporter_Y4.jpg',
  'Transporter-4': 'transporter_Y4.jpg',
  'Transporter (Year 3)': 'transporter_Y3.png',
  'Transporter-3': 'transporter_Y3.png',
  'Transporter-2': 'Transporter-2.png',
};

// Starlink 그룹용 색상 생성 (미션별로 일관된 색상)
const getStarlinkColor = (missionName) => {
  // 미션 이름에서 숫자 추출
  const numbers = missionName.match(/\d+/g);
  if (!numbers) return { primary: '#3b82f6', secondary: '#1d4ed8' };
  
  const seed = numbers.reduce((acc, num) => acc + parseInt(num), 0);
  const hue = (seed * 37) % 360;
  
  return {
    primary: `hsl(${hue}, 70%, 60%)`,
    secondary: `hsl(${hue}, 80%, 40%)`
  };
};

/**
 * 미션 이름으로 패치 이미지 URL을 가져옵니다.
 * @param {string} missionName - 미션 이름 (예: "Falcon 9 Block 5 | Starlink Group 6-85")
 * @returns {Object} - { url: string | null, isStarlink: boolean, colors: Object }
 */
export const getMissionPatchUrl = (missionName) => {
  if (!missionName) return { url: null, isStarlink: false, colors: null };

  // 미션 이름 정규화
  const cleanName = missionName
    .replace(/Falcon 9 Block 5 \| /gi, '')
    .replace(/Falcon 9 \| /gi, '')
    .replace(/Falcon Heavy \| /gi, '')
    .trim();

  // Starlink 그룹 체크
  if (cleanName.toLowerCase().includes('starlink group') || 
      cleanName.toLowerCase().includes('starlink-')) {
    return {
      url: `${BASE_URL}/Starlink.png`,
      isStarlink: true,
      colors: getStarlinkColor(cleanName),
      groupName: cleanName
    };
  }

  // 직접 매핑 시도
  if (PATCH_MAPPING[cleanName]) {
    return {
      url: `${BASE_URL}/${PATCH_MAPPING[cleanName]}`,
      isStarlink: false,
      colors: null
    };
  }

  // 부분 매칭 시도 (미션 이름이 포함된 경우)
  for (const [key, value] of Object.entries(PATCH_MAPPING)) {
    if (cleanName.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(cleanName.toLowerCase())) {
      return {
        url: `${BASE_URL}/${value}`,
        isStarlink: false,
        colors: null
      };
    }
  }

  // CRS 미션 패턴 체크
  const crsMatch = cleanName.match(/CRS[- ]?(\d+)/i);
  if (crsMatch) {
    const crsNum = crsMatch[1];
    const possibleFiles = [
      `CRS-${crsNum}.png`,
      `CRS_${crsNum}.png`,
      `SpaceX_CRS-${crsNum}_Patch.png`
    ];
    return {
      url: `${BASE_URL}/${possibleFiles[0]}`,
      isStarlink: false,
      colors: null
    };
  }

  // Crew 미션 패턴 체크
  const crewMatch = cleanName.match(/Crew[- ]?(\d+)/i);
  if (crewMatch) {
    const crewNum = crewMatch[1];
    return {
      url: `${BASE_URL}/Crew-${crewNum}_SpaceX.png`,
      isStarlink: false,
      colors: null
    };
  }

  // NROL 미션 패턴 체크
  const nrolMatch = cleanName.match(/NROL[- ]?(\d+)/i);
  if (nrolMatch) {
    const nrolNum = nrolMatch[1];
    // 매핑에 있는 경우 우선 사용
    if (PATCH_MAPPING[`NROL-${nrolNum}`]) {
      return {
        url: `${BASE_URL}/${PATCH_MAPPING[`NROL-${nrolNum}`]}`,
        isStarlink: false,
        colors: null
      };
    }
    // 매핑에 없으면 일반 패턴 시도
    return {
      url: `${BASE_URL}/NROL-${nrolNum}.png`,
      isStarlink: false,
      colors: null
    };
  }

  return { url: null, isStarlink: false, colors: null };
};

/**
 * 패치 이미지 URL이 유효한지 확인합니다.
 * @param {string} url - 이미지 URL
 * @returns {Promise<boolean>}
 */
export const validatePatchUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

export default getMissionPatchUrl;

