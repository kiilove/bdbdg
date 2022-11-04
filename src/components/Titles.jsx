export const pageTitle = (props) => (
  <div className="block w-full h-18 items-center">
    <p className="text-white text-xl font-semibold leading-3">{props.title}</p>
    <span className="text-gray-400 text-base">{props.desp}</span>
  </div>
);

export const widgetTitle = (props) => (
  <div className="flex w-full h-12 items-center ">
    <p className="text-white text-lg font-base">{props.title}</p>
  </div>
);
