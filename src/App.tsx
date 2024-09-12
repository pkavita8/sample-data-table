import React, { useMemo, useState } from "react";
import "./App.css";
import data from "./property_data.json";
import { useSortableTable } from "./useSortableTable";
import {
  TbLayoutSidebarLeftCollapseFilled,
  TbLayoutSidebarRightCollapseFilled,
} from "react-icons/tb";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { PropertyType } from "./constants";

const properties: PropertyType[] = data.data.propertiesPage.properties;

const keys = Object.keys(properties[0]).filter((key) => key !== "__typename");

function App() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState("asc");

  const [selectedTag, setSelectedTag] = useState<string>("");

  const toggleColumn = (key: string) => {
    setCollapsed((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const sortColumn = (key: string, sortOrder: string) => {
    setSortField(key);
    setOrder(sortOrder);
    handleSorting(key, sortOrder);
  };

  const allTags = useMemo(
    () => [...new Set(properties.map((property) => property.aggregationTag))],
    []
  );

  const filteredProperties = useMemo(() => {
    if (!selectedTag) return properties;

    return properties.filter(
      (property) =>
        property.aggregationTag.toLowerCase() === selectedTag.toLowerCase()
    );
  }, [selectedTag]);

  const [tableData, handleSorting] = useSortableTable(filteredProperties);

  const handleChangeTag = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTag(event.target.value);
  };

  return (
    <div className="p-6 w-full">
      <header>
        <h1 className="text-3xl font-bold text-center pb-6">Sample App</h1>
        <div className="flex gap-6 pb-2">
          <h1>Filter By Aggregation Tag</h1>
          <select
            value={selectedTag}
            onChange={handleChangeTag}
            className="dropdown"
          >
            <option value="">-- Select a Aggregation Tag --</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </header>
      <table className="table table-fixed border-separate border-spacing-0 border text-center">
        <thead className="table-header-group border border-slate-600 sticky top-0 bg-white">
          <tr className="table-row border border-slate-600">
            {keys.map((key) => {
              const CollapseIcon = collapsed[key]
                ? TbLayoutSidebarLeftCollapseFilled
                : TbLayoutSidebarRightCollapseFilled;

              return (
                <th
                  key={key}
                  className={`table-cell border border-slate-600 capitalize p-3 max-h-6  ${
                    collapsed[key] ? "hidden" : ""
                  }`}
                >
                  <div className="flex w-full gap-5 justify-between items-center">
                    <div className="flex-col gap-0">
                      <MdKeyboardArrowUp
                        className={`cursor-pointer 
                             ${
                               sortField !== key ||
                               (sortField === key && order === "desc")
                                 ? "opacity-40"
                                 : ""
                             }`}
                        onClick={() => sortColumn(key, "asc")}
                      />
                      <MdKeyboardArrowDown
                        className={`cursor-pointer
                             ${
                               sortField !== key ||
                               (sortField === key && order === "asc")
                                 ? "opacity-40"
                                 : ""
                             }`}
                        onClick={() => sortColumn(key, "desc")}
                      />
                    </div>
                    <p>{key.replace(/([A-Z])/g, " $1")}</p>

                    {key !== "aggregationTag" && key !== "archipelagoId" && (
                      <CollapseIcon onClick={() => toggleColumn(key)} />
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody
          className="overflow-scroll"
          style={{ height: "calc(100vh - 300px" }}
        >
          {tableData.map((element: PropertyType) => (
            <tr
              key={element.archipelagoId}
              className={"table-row overscroll-x-auto"}
            >
              {keys.map((key) => (
                <td
                  key={key}
                  className={`table-cell border border-slate-600 p-3 max-h-6 ${
                    collapsed[key] ? "hidden" : ""
                  }`}
                >
                  {key === "pictures"
                    ? element.pictures[0].filename
                    : element[key as keyof (typeof properties)[0]] || "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
