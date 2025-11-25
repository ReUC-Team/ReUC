import { useState } from 'react';
import ResourceItem from './ResourceItem';
import ResourceUploadModal from './ResourceUploadModal';
import { useProjectResources } from '../hooks/useProjectResources';
import { downloadFile } from '../projectsService';

export default function ProjectResourcesSection({ projectUuid, project, canManage, onResourceChange }) {
  const { uploadResource, updateResource, deleteResource, isLoading } = useProjectResources(projectUuid);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const resources = project.resources || [];

  const handleUpload = async (file) => {
    await uploadResource(file);
    setIsUploadModalOpen(false);
    if (onResourceChange) onResourceChange();
  };

  const handleUpdate = async (file) => {
    if (editingResource) {
      await updateResource(editingResource.uuid, file);
      setEditingResource(null);
      if (onResourceChange) onResourceChange();
    }
  };

  const handleDelete = async (resource) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${resource.name}"?`)) {
      await deleteResource(resource.uuid);
      if (onResourceChange) onResourceChange();
    }
  };

  const handleDownload = (resource) => {
    downloadFile(resource.downloadUrl, resource.name, resource.type);
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold dark:text-gray-100">
          Recursos del <span className="text-lime-700 dark:text-lime-500">proyecto</span>
        </h2>
        {canManage && (
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition font-semibold flex items-center gap-2 text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Subir recurso
          </button>
        )}
      </div>

      {resources.length === 0 ? (
        <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-lg p-8 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400">No hay recursos subidos en este proyecto.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resources.map((resource) => (
            <ResourceItem
              key={resource.uuid}
              resource={resource}
              teamMembers={project.teamMembers || []}
              onDownload={handleDownload}
              onEdit={(res) => setEditingResource(res)}
              onDelete={handleDelete}
              canManage={canManage}
            />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <ResourceUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onConfirm={handleUpload}
        isLoading={isLoading}
      />

      {/* Edit Modal */}
      <ResourceUploadModal
        isOpen={!!editingResource}
        onClose={() => setEditingResource(null)}
        onConfirm={handleUpdate}
        isLoading={isLoading}
        isEditing={true}
      />
    </div>
  );
}
