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
  return (
    <>
      <div className="personal-section flex-col flex gap-5">
        <h3>Account Security</h3>
        <div className="flex gap-5 justify-between  items-center border-b">
          <div className="flex flex-col">
            <h4>Password</h4>
            <p className="text-sm">Last Update: </p>
          </div>
          <button className="px-2 text-sm">Change</button>
        </div>
        <div className="flex gap-5 justify-between items-center border-b">
          <div className="flex flex-col">
            <h4>Verified Email</h4>
            <p className="text-sm">{email} </p>
          </div>
          <span className={emailVerified ? "verified" : "unverified"}>
            {emailVerified ? "Verified" : "Not Verified"}
          </span>
        </div>
        <div className="flex gap-5 justify-between  items-center border-b">
          <div className="flex flex-col">
            <h4>Verified Phone Number</h4>
            <p className="text-sm">{phoneNumber}</p>
          </div>
          <span className={phoneVerified ? "verified" : "unverified"}>
            {phoneVerified ? "Verified" : "Not Verified"}
          </span>
        </div>
      </div>
      <div className="personal-section flex-col border-red-300 flex gap-2">
        <h3 className="text-red-300">Dangerous Zone</h3>
        <div className="flex gap-5 justify-between  items-center">
          <div className="flex flex-col">
            <h4>Delete account</h4>
            <p>This action is irreversible! It daletes all the data.</p>
          </div>
          <button>Delete</button>
        </div>
      </div>
    </>
  );
}
