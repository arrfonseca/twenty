import { useSelectedRecordIdOrThrow } from '@/action-menu/actions/record-actions/single-record/hooks/useSelectedRecordIdOrThrow';
import { ActionHookWithObjectMetadataItem } from '@/action-menu/actions/types/ActionHook';
import { useDestroyOneRecord } from '@/object-record/hooks/useDestroyOneRecord';
import { useRecordTable } from '@/object-record/record-table/hooks/useRecordTable';
import { AppPath } from '@/types/AppPath';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useCallback, useState } from 'react';
import { useNavigateApp } from '~/hooks/useNavigateApp';

export const useDestroySingleRecordAction: ActionHookWithObjectMetadataItem = ({
  objectMetadataItem,
}) => {
  const recordId = useSelectedRecordIdOrThrow();

  const [isDestroyRecordsModalOpen, setIsDestroyRecordsModalOpen] =
    useState(false);

  const navigateApp = useNavigateApp();

  const { resetTableRowSelection } = useRecordTable({
    recordTableId: objectMetadataItem.namePlural,
  });

  const { destroyOneRecord } = useDestroyOneRecord({
    objectNameSingular: objectMetadataItem.nameSingular,
  });

  const handleDeleteClick = useCallback(async () => {
    resetTableRowSelection();

    await destroyOneRecord(recordId);
    navigateApp(AppPath.RecordIndexPage, {
      objectNamePlural: objectMetadataItem.namePlural,
    });
  }, [
    resetTableRowSelection,
    destroyOneRecord,
    recordId,
    navigateApp,
    objectMetadataItem.namePlural,
  ]);

  const onClick = () => {
    setIsDestroyRecordsModalOpen(true);
  };

  return {
    onClick,
    ConfirmationModal: (
      <ConfirmationModal
        isOpen={isDestroyRecordsModalOpen}
        setIsOpen={setIsDestroyRecordsModalOpen}
        title={'Permanently Destroy Record'}
        subtitle={
          'Are you sure you want to destroy this record? It cannot be recovered anymore.'
        }
        onConfirmClick={async () => {
          await handleDeleteClick();
        }}
        confirmButtonText={'Permanently Destroy Record'}
      />
    ),
  };
};
