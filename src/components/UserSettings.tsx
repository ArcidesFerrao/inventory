import { useTranslations } from "next-intl";

type UserSettingsProps = {
  email?: string | null;
  phoneNumber?: string | null;
  emailVerified?: Date | null;
  phoneVerified: boolean | null;
};

export default function UserSettings({
  email,
  phoneNumber,
  emailVerified,
  phoneVerified,
}: UserSettingsProps) {
  const t = useTranslations("Common");
  return (
    <>
      <div className="personal-section flex-col flex gap-5">
        <h3>{t("accountSecurity")}</h3>
        <div className="flex gap-5 justify-between  items-center border-b">
          <div className="flex flex-col">
            <h4>{t("password")}</h4>
            <p className="text-sm">{t("lastUpdate")}: </p>
          </div>
          <button disabled className="px-2 text-sm">
            {t("changePassword")}
          </button>
        </div>
        <div className="flex gap-5 justify-between items-center border-b">
          <div className="flex flex-col">
            <h4>{t("verifiedEmail")}</h4>
            <p className="text-sm">{email} </p>
          </div>
          <span className={emailVerified ? "verified" : "unverified"}>
            {emailVerified ? "Verified" : "Not Verified"}
          </span>
        </div>
        <div className="flex gap-5 justify-between  items-center border-b">
          <div className="flex flex-col">
            <h4>{t("verifiedPhoneNumber")}</h4>
            <p className="text-sm">{phoneNumber}</p>
          </div>
          <span className={phoneVerified ? "verified" : "unverified"}>
            {phoneVerified ? "Verified" : "Not Verified"}
          </span>
        </div>
      </div>
      <div className="personal-section flex-col border-red-300 flex gap-2">
        <h3 className="text-red-300">{t("dangerousZone")}</h3>
        <div className="flex gap-5 justify-between  items-center">
          <div className="flex flex-col">
            <h4>{t("deleteAccount")}</h4>
            <p>{t("deleteAllData")}</p>
          </div>
          <button disabled>{t("delete")}</button>
        </div>
      </div>
    </>
  );
}
