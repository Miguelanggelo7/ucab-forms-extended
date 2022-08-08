export const TEXT = "text";
export const TEXTAREA = "textarea";
export const RADIO = "radio";
export const CHECKBOX = "checkbox";
export const SELECT = "select";
export const SORTABLE = "sortable";
export const SLIDER = "slider";
export const RATING = "rating";
export const DATE = "date";
export const TIME = "time";
export const DATETIME = "datetime";
export const FILE = "file";
export const VOICE = "voice";
export const SLIDERMOJI = "slidermoji";
export const ARRAY = "array";
export const IMAGE = "image";

export const compatibility = {
  [TEXT]: [TEXT, TEXTAREA, RADIO, SELECT],
  [TEXTAREA]: [TEXT, TEXTAREA, RADIO, SELECT],
  [RADIO]: [TEXT, TEXTAREA, RADIO, SELECT],
  [CHECKBOX]: [CHECKBOX],
  [SELECT]: [TEXT, TEXTAREA, RADIO, SELECT],
  [SORTABLE]: [SORTABLE],
  [SLIDER]: [TEXT, TEXTAREA, RADIO, SELECT, SLIDER, RATING, SLIDERMOJI],
  [RATING]: [TEXT, TEXTAREA, RADIO, SELECT, SLIDER, RATING, SLIDERMOJI],
  [DATE]: [DATE, TIME, DATETIME],
  [TIME]: [DATE, TIME, DATETIME],
  [DATETIME]: [DATE, TIME, DATETIME],
  [FILE]: [FILE],
  [VOICE]: [VOICE],
  [SLIDERMOJI]: [TEXT, TEXTAREA, RADIO, SELECT, SLIDER, RATING, SLIDERMOJI],
  [ARRAY]: [ARRAY],
  [IMAGE]: [FILE, IMAGE],
};

export const ratingLabels = [
  "Sin calificar",
  "Malo",
  "Deficiente",
  "Regular",
  "Bueno",
  "Excelente",
];

export const questionTypes = [
  {
    value: TEXT,
    label: "Respuesta breve",
  },
  {
    value: TEXTAREA,
    label: "Respuesta larga",
  },
  {
    value: RADIO,
    label: "Opción múltiple",
  },
  {
    value: CHECKBOX,
    label: "Casillas de verificación",
  },
  {
    value: SELECT,
    label: "Lista desplegable",
  },
  {
    value: SORTABLE,
    label: "Lista ordenada",
  },
  {
    value: SLIDER,
    label: "Escala lineal",
  },
  {
    value: RATING,
    label: "Escala de valoración",
  },
  {
    value: DATE,
    label: "Fecha",
  },
  {
    value: TIME,
    label: "Hora",
  },
  {
    value: DATETIME,
    label: "Fecha y hora",
  },
  {
    value: FILE,
    label: "Carga de archivo",
  },
  {
    value: VOICE,
    label: "Audio",
  },
  {
    value: SLIDERMOJI,
    label: "Escala lineal con emoji",
  },
  {
    value: ARRAY,
    label: "Matriz",
  },
  {
    value: IMAGE,
    label: "Imagen",
  },
];

export const arrayOptions = [
  {
    value: TEXT,
    label: "Texto",
  },
  {
    value: CHECKBOX,
    label: "Selección",
  },
];

export const defaultQuestion = {
  title: "Pregunta sin título",
  type: TEXT,
  required: false,
  specialType: "",
  restricted: false,
  descriptionCheck: false,
  description: "",
  image: null,
};
