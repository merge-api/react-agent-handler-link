import { useCallback, useEffect, useState } from 'react';
import {
  InitializeProps,
  UseAgentHandlerLinkProps,
  UseAgentHandlerLinkResponse,
} from './types';
import useScript from './hooks/useScript';

const isLinkTokenDefined = (
  config: UseAgentHandlerLinkProps
): config is InitializeProps => config?.linkToken !== undefined;

export const useAgentHandlerLink = ({
  ...config
}: UseAgentHandlerLinkProps): UseAgentHandlerLinkResponse => {
  const initializeSrc = (() => {
    const base = config?.tenantConfig?.apiBaseURL || '';
    // Local dev
    if (/localhost|127\.0\.0\.1/.test(base)) {
      return 'http://localhost:3005/initialize.js';
    }
    // Develop
    if (base.includes('-develop.') || base.includes('ah-api-develop.merge.dev')) {
      return 'https://ah-cdn-develop.merge.dev/initialize.js';
    }
    // Default: Production
    return 'https://ah-cdn.merge.dev/initialize.js';
  })();

  const [loading, error] = useScript({
    src: initializeSrc,
    checkForExisting: true,
  });
  const [isReady, setIsReady] = useState(false);
  const isServer = typeof window === 'undefined';
  const isReadyForInitialization =
    !isServer &&
    !!window.AgentHandlerLink &&
    !loading &&
    !error &&
    isLinkTokenDefined(config);

  useEffect(() => {
    if (
      isReadyForInitialization &&
      window.AgentHandlerLink &&
      isLinkTokenDefined(config)
    ) {
      window.AgentHandlerLink.initialize({
        ...config,
        onReady: () => setIsReady(true),
      });
    }
  }, [isReadyForInitialization, config]);

  const open = useCallback(() => {
    if (window.AgentHandlerLink) {
      window.AgentHandlerLink.openLink(config);
    }
  }, [config]);

  return { open, isReady, error };
};
