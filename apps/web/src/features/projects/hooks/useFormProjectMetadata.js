import { useEffect, useState } from "react";
import { getCreateMetadata } from "../projectsService.js";

export default function useFormProjectMetadata() {
  const [faculties, setFaculty] = useState([]);
  const [projectTypes, setProjectType] = useState([]);
  const [problemTypes, setProblemType] = useState([]);
  const [defaultBanners, setDefaultBanners] = useState([]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await getCreateMetadata();

        if (!response.success) {
          console.error(
            response.err || "Error al obtener la metadata para el formulario"
          );
          return;
        }

        setFaculty(response.data.faculties);
        setProjectType(response.data.projectTypes);
        setProblemType(response.data.problemTypes);
        setDefaultBanners(response.data.defaultBanners);
      } catch (err) {
        console.error("useFormProjectMetadata", err);
      }
    };

    fetchMetadata();
  }, []);

  return { faculties, projectTypes, problemTypes, defaultBanners };
}
