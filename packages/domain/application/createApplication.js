import { Application } from "./Application.js";
import { FileDescriptor } from "../file/FileDescriptor.js";
import { applicationRepo } from "@reuc/infrastructure/applicationRepo.js";

export async function createApplication({ uuidAuthor, application, file }) {
  const newApplication = new Application({
    ...application,
    uuidOutsider: uuidAuthor,
    applicationProjectType: application.projectType,
    applicationFaculty: application.faculty,
    applicationProblemType: application.problemType,
    applicationProblemTypeOther: application.problemTypeOther,
  });

  let descriptorPrimitives = undefined;
  let payloadPrimitives = undefined;

  if (file?.defaultImage) {
    const fd = new FileDescriptor({
      name: file.defaultImage,
      modelTarget: "APPLICATION",
      purpose: "BANNER",
      isDefault: true,
    });

    descriptorPrimitives = fd.toPrimitives();
  } else if (file?.customImage?.file?.buffer) {
    const fd = new FileDescriptor({
      name: file.customImage.name,
      modelTarget: "APPLICATION",
      purpose: "BANNER",
      isDefault: false,
    });

    descriptorPrimitives = fd.toPrimitives();
    payloadPrimitives = {
      buffer: file.customImage.file.buffer,
      mimetype: file.customImage.file.mimetype,
    };
  }

  const savedApplication = await applicationRepo.save(
    newApplication.toPrimitives(),
    {
      customImage:
        payloadPrimitives && descriptorPrimitives
          ? {
              fileDescriptor: descriptorPrimitives,
              filePayload: payloadPrimitives,
            }
          : undefined,
      defaultImage:
        descriptorPrimitives && descriptorPrimitives.isDefault
          ? descriptorPrimitives
          : undefined,
    }
  );

  return savedApplication;
}
