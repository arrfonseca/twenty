import { useSelectedRecordIdOrThrow } from '@/action-menu/actions/record-actions/single-record/hooks/useSelectedRecordIdOrThrow';
import { ActionHookWithoutObjectMetadataItem } from '@/action-menu/actions/types/ActionHook';
import { CoreObjectNameSingular } from '@/object-metadata/types/CoreObjectNameSingular';
import { AppPath } from '@/types/AppPath';
import { useActiveWorkflowVersion } from '@/workflow/hooks/useActiveWorkflowVersion';
import { isDefined } from 'twenty-shared/utils';
import { useNavigateApp } from '~/hooks/useNavigateApp';

export const useSeeActiveVersionWorkflowSingleRecordAction: ActionHookWithoutObjectMetadataItem =
  () => {
    const recordId = useSelectedRecordIdOrThrow();

    const workflowActiveVersion = useActiveWorkflowVersion(recordId);

    const navigateApp = useNavigateApp();

    const onClick = () => {
      if (!isDefined(workflowActiveVersion)) {
        return;
      }

      navigateApp(AppPath.RecordShowPage, {
        objectNameSingular: CoreObjectNameSingular.WorkflowVersion,
        objectRecordId: workflowActiveVersion.id,
      });
    };

    return {
      onClick,
    };
  };
