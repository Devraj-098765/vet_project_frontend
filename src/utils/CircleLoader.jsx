import { RotatingLines } from "react-loader-spinner";


export const CircleLoader = () => {
    return (
      <div className="flex justify-center items-center">
        <div>
          <RotatingLines
            strokeColor="#122E99"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        </div>
      </div>
    );
}