import PrimaryButton from "../../../shared/PrimaryButton";
import TextInput from "../../../shared/TextInput";

const AuthorizeOnRoom = ({ error, password, setPassword, authorize }) => {
  return (
    <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center gap-6">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-semibold">Password Protected Room</h2>
        <p className="text-sm opacity-70 max-w-md">
          Enter the password you received to join this collaborative space.
        </p>
        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
      </div>

      <div className="flex flex-col items-center gap-4 w-80">
        <TextInput
          placeholder="Room password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        <PrimaryButton onClick={authorize} disabled={!password.trim()}>
          Join Room
        </PrimaryButton>
      </div>
    </div>
  );
};

export default AuthorizeOnRoom;
