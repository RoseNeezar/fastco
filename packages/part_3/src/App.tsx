import Q1 from "./components/Q1";
import Tabs, { ITab } from "./components/Tabs";
import Q2 from "./components/Q2";
import Q3 from "./components/Q3";

function App() {
  const tabContent: ITab[] = [
    {
      id: "1",
      label: "Q1",
      content: <Q1 />,
    },
    {
      id: "2",
      label: "Q2",
      content: <Q2 />,
    },
    {
      id: "3",
      label: "Q3",
      content: <Q3 />,
    },
  ];
  return (
    <div className="">
      <Tabs data={tabContent} />
    </div>
  );
}

export default App;
