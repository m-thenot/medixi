"use client";

import {
  useTable,
  List,
  ShowButton,
  DateField,
  FilterDropdown
} from "@refinedev/antd";
import { ExaminationState } from "@types";
import { getTagColor } from "@utils";
import { Table, Tooltip, Tag, Radio } from "antd";
import { useTranslation } from "react-i18next";

const ExaminationsList: React.FC = () => {
  const { t } = useTranslation();
  const { tableProps } = useTable({
    syncWithLocation: true,

    sorters: {
      initial: [
        {
          field: "examination_date",
          order: "desc"
        }
      ]
    },

    meta: {
      fields: [
        "id",
        "examination_type",
        "examination_date",
        "description",
        "state"
      ]
    }
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="examination_type"
          title={t("patients.fields.examType")}
          render={(value) => t("examinationTypes.".concat(value))}
        />
        <Table.Column
          dataIndex="description"
          title={t("patients.fields.examDetails")}
          render={(value) => (
            <>
              <Tooltip title={value} placement="topLeft">
                <div className="truncate max-w-36">{value}</div>
              </Tooltip>
            </>
          )}
        />

        <Table.Column
          dataIndex="examination_date"
          title={t("patients.fields.examDate")}
          render={(value) => <DateField value={value} locales="fr" />}
        />

        <Table.Column
          dataIndex="state"
          title={t("patients.fields.examState")}
          render={(value) => (
            <Tag key={value} color={getTagColor(value)}>
              {t("examinationState.".concat(value)).toUpperCase()}
            </Tag>
          )}
          filterDropdown={(props) => (
            <FilterDropdown {...props}>
              <Radio.Group>
                {Object.keys(ExaminationState).map((key) => (
                  <Radio value={key} key={key}>
                    {t("examinationState.".concat(key)).toUpperCase()}
                  </Radio>
                ))}
              </Radio.Group>
            </FilterDropdown>
          )}
        />

        <Table.Column
          title={t("table.actions")}
          dataIndex="id"
          render={(value) => {
            return <ShowButton recordItemId={value} />;
          }}
        />
      </Table>
    </List>
  );
};

export default ExaminationsList;
