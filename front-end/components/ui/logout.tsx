import * as React from "react";

function IconLogout(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 900 1000"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M502 850V750h98v100c0 26.667-9.667 50-29 70s-43 30-71 30H100c-26.667 0-50-10-70-30S0 876.667 0 850V150c0-28 10-51.667 30-71s43.333-29 70-29h400c28 0 51.667 9.667 71 29s29 43 29 71v150h-98V150H100v700h402m398-326L702 720V600H252V450h450V330l198 194" />
    </svg>
  );
}

export default IconLogout;

