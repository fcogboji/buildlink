/** Accent colour for "Link" — matches the landing hero wordmark. */
export const LOGO_LINK_CLASS = "text-[#86efac]";

export function LogoWordmark() {
  return (
    <>
      Build<span className={LOGO_LINK_CLASS}>Link</span>
    </>
  );
}
