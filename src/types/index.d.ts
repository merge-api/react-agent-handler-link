export type AdditionalSuccessfulLinkInfo = {
  isTokenForOtherPreexistingLinkedAccount?: boolean;
};

export type ValidationErrors = ValidationError[];

export type ValidationError = {
  detail: string;
  problem_type?: string;
  [key: string]: any;
};

export interface AgentHandlerLink {
  initialize: (config: InitializeProps) => void;
  update: (config: {
    linkToken: string;
    onValidationError?: (errors: ValidationErrors) => void;
    onSuccess: (
      publicToken: string,
      additionalInfo?: AdditionalSuccessfulLinkInfo
    ) => void;
  }) => void;
  openLink: (config: UseAgentHandlerLinkProps) => void;
}

export interface TenantConfig {
  apiBaseURL?: string;
}
export interface UseAgentHandlerLinkProps {
  linkToken?: string | undefined;
  tenantConfig?: TenantConfig;
  onValidationError?: (errors: ValidationErrors) => void;
  onSuccess: (
    publicToken: string,
    additionalInfo?: AdditionalSuccessfulLinkInfo
  ) => void;
  onExit?: () => void;
  /**
   * Passing this allows users to target a specific element in their page to embed link under (eg for modals)
   */
  parentContainerID?: string;
}

export interface InitializeProps extends UseAgentHandlerLinkProps {
  linkToken: string;
  onReady?: () => void;
}

export type UseAgentHandlerLinkResponse = {
  open: () => void;
  isReady: boolean;
  error: ErrorEvent | null;
};

declare global {
  interface Window {
    AgentHandlerLink: AgentHandlerLink;
  }
}
