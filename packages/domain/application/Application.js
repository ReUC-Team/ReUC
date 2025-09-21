export class Application {
  constructor({
    uuid_application = undefined,
    uuidOutsider,
    title,
    shortDescription,
    description,
    deadline,
    visibility = undefined, // It is not present in the form rn
    applicationProjectType = [],
    applicationFaculty = [],
    applicationProblemType = [],
    applicationProblemTypeOther = undefined,
  }) {
    this.checkRequiredFields({
      uuidOutsider,
      title,
      shortDescription,
      description,
      deadline,
    });

    this.uuid_application = uuid_application;
    this.uuidOutsider = uuidOutsider;
    this.title = title;
    this.shortDescription = shortDescription;
    this.description = description;
    this.deadline = new Date(deadline);
    this.visibility = visibility;
    this.applicationProjectType = this.parseAndValidateNumberArray(
      applicationProjectType,
      "Tipo de Proyecto"
    );
    this.applicationFaculty = this.parseAndValidateNumberArray(
      applicationFaculty,
      "Facultad"
    );
    this.applicationProblemType = this.parseAndValidateNumberArray(
      applicationProblemType,
      "Tipo de Problematica"
    );
    this.applicationCustomProblemType = this.normalizeProblemType(
      applicationProblemTypeOther
    );
  }

  static allowedFields = [
    "uuid_application",
    "uuidOutsider",
    "title",
    "shortDescription",
    "description",
    "deadline",
    "visibility",
    "applicationProjectType",
    "applicationFaculty",
    "applicationProblemType",
    "applicationCustomProblemType",
  ];

  parseAndValidateNumberArray(input = [], key = "Unknow") {
    const normalizedInput = Array.isArray(input) ? input : [input];
    const parsedArray = normalizedInput.map(Number);

    parsedArray.map((n) => {
      if (isNaN(n)) {
        throw new Error(`El campo "${key}" contiene un valor inválido.`);
      }
    });

    return parsedArray;
  }

  normalizeProblemType(value = undefined) {
    if (value === undefined || value === " " || value === "") {
      return undefined;
    }

    return value.trim().toLowerCase();
  }

  checkRequiredFields(fields = {}) {
    for (const [key, value] of Object.entries(fields)) {
      if (
        value === undefined ||
        value === null ||
        value === " " ||
        value === ""
      ) {
        throw new Error(
          `El campo ${key} es obligatorio y no puede estar vacío.`
        );
      }
    }
  }

  toPrimitives() {
    const primitive = {};

    for (const key of Application.allowedFields) {
      if (this[key] !== undefined) {
        primitive[key] = this[key];
      }
    }

    return primitive;
  }
}
