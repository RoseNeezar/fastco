import React, { ReactNode, useState } from "react";

export interface ITab {
  id: string;
  label: string;
  content: ReactNode;
}

interface ITabsProp {
  data: ITab[];
}

const Tabs: React.FC<ITabsProp> = ({ data: tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="p-8">
      <div className="flex justify-center flex-col">
        <div className="w-full">
          <div className="tabs tabs-boxed w-fit m-auto">
            <ul className="">
              {tabs.map((tab) => (
                <li
                  key={tab.id}
                  className={`tab ${activeTab === tab.id ? "tab-active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`${activeTab === tab.id ? "block" : "hidden"}`}
            >
              {tab.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
