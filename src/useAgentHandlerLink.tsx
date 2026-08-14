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

const DEFAULT_CDN_URL = 'https://ah-cdn.merge.dev/initialize.js';

// Tenants on their own domain need their own CDN: the widget sets a cookie the API
// reads back, and a page can only set cookies for a domain it is under.
const API_BASE_URL_TO_CDN_URL: Record<string, string> = {
  'https://ah-api-factory-usw2.factorymerge.com':
    'https://ah-cdn.factorymerge.com/initialize.js',
  // Factory's API is moving to its own apex. This lookup is an exact string match with
  // a silent fallback to the shared merge.dev CDN, so the new host needs its own entry
  // or the widget quietly loads from the wrong CDN with no error.
  'https://connectors-api.factory.ai':
    'https://ah-cdn.factorymerge.com/initialize.js',
};

export const useAgentHandlerLink = ({
  ...config
}: UseAgentHandlerLinkProps): UseAgentHandlerLinkResponse => {
  const initializeSrc = (() => {
    // An explicit override wins over every derived value below.
    if (config?.tenantConfig?.cdnBaseUrl)
      return `${config.tenantConfig.cdnBaseUrl}/initialize.js`;
    const base = config?.tenantConfig?.apiBaseURL || '';
    const tenantCdn = API_BASE_URL_TO_CDN_URL[base];
    if (tenantCdn) {
      return tenantCdn;
    }
    // Local dev
    if (/localhost|127\.0\.0\.1/.test(base)) {
      return 'http://localhost:3005/initialize.js';
    }
    // Develop
    if (base.includes('-develop.') || base.includes('ah-api-develop.merge.dev')) {
      return 'https://ah-cdn-develop.merge.dev/initialize.js';
    }
    // Default: Production
    return DEFAULT_CDN_URL;
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
