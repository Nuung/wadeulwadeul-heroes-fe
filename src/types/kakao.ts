export interface LatLng {
  lat: number;
  lng: number;
  getLat?: () => number;
  getLng?: () => number;
}

export interface MapInstance {
  setCenter: (coords: LatLng) => void;
  setLevel: (level: number) => void;
  getCenter: () => LatLng;
  getLevel: () => number;
  setMapTypeId: (mapTypeId: string) => void;
  setZoomable: (zoomable: boolean) => void;
  setDraggable: (draggable: boolean) => void;
  getBounds: () => {
    getNorthEast: () => LatLng;
    getSouthWest: () => LatLng;
  };
}

export interface LatNLng {
  lat: number;
  lng: number;
  getLat?: () => number;
  getLng?: () => number;
}

export interface MarkerInstance {
  setMap: (map: MapInstance | null) => void;
  setPosition: (position: LatLng) => void;
  getPosition: () => LatLng;
  setTitle: (title: string) => void;
  setClickable: (clickable: boolean) => void;
  setZIndex: (zIndex: number) => void;
}

export interface InfoWindowInstance {
  open: (map: MapInstance, marker: MarkerInstance) => void;
  close: () => void;
  setContent: (content: string) => void;
  getContent: () => string;
  setPosition: (position: LatLng) => void;
  getPosition: () => LatLng;
  setZIndex: (zIndex: number) => void;
}

export interface MarkerImageInstance {
  getSize: () => { width: number; height: number };
  getOffset: () => { x: number; y: number };
}

export interface GeocoderResult {
  address_name: string;
  address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    mountain_yn: string;
    main_address_no: string;
    sub_address_no: string;
    zip_code: string;
  };
  road_address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    road_name: string;
    underground_yn: string;
    main_building_no: string;
    sub_building_no: string;
    building_name: string;
    zone_no: string;
  };
  x: string;
  y: string;
}

export interface Geocoder {
  addressSearch: (
    address: string,
    callback: (result: GeocoderResult[], status: string) => void,
  ) => void;
}

export interface KakaoServices {
  Status: {
    OK: string;
    ZERO_RESULT: string;
    ERROR: string;
  };
  Geocoder: new () => Geocoder;
}

export interface KakaoMap {
  LatLng: new (lat: number, lng: number) => LatLng;
  Size: new (
    width: number,
    height: number,
  ) => { width: number; height: number };
  Point: new (x: number, y: number) => { x: number; y: number };
  MarkerImage: new (
    src: string,
    size: { width: number; height: number },
    options?: {
      offset?: { x: number; y: number };
    },
  ) => MarkerImageInstance;
  Map: new (
    container: HTMLElement,
    options: {
      center: LatLng;
      level: number;
    },
  ) => MapInstance;
  Marker: new (options: {
    position: LatLng;
    map?: MapInstance | null;
    image?: MarkerImageInstance;
    title?: string;
  }) => MarkerInstance;
  InfoWindow: new (options: {
    content: string;
    position?: LatLng;
    removable?: boolean;
    zIndex?: number;
  }) => InfoWindowInstance;
  load: (callback: () => void) => void;
  event: {
    addListener: (
      target: MapInstance | MarkerInstance,
      eventName: string,
      handler: (event: unknown) => void,
    ) => void;
    removeListener: (
      target: MapInstance | MarkerInstance,
      eventName: string,
      handler: (event: unknown) => void,
    ) => void;
  };
  services: KakaoServices;
}

declare global {
  interface Window {
    kakao: {
      maps: KakaoMap;
    };
  }
}

export {};
