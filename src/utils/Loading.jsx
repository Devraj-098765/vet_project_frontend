import { ThreeDots } from "react-loader-spinner";

export const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <ThreeDots
        visible={true}
        height="40"
        width="40"
        color="#2970ff"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
      />
    </div>
  );
};
