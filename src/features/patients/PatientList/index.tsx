"use client";

import { BaseRecord } from "@refinedev/core";
import {
  useTable,
  List,
  EditButton,
  ShowButton,
  DeleteButton,
  DateField
} from "@refinedev/antd";
import { Table, Space, Form, Input } from "antd";
import { useTranslation } from "react-i18next";

const { Search } = Input;

const PatientList: React.FC = () => {
  const { t } = useTranslation();
  const { tableProps, searchFormProps } = useTable({
    syncWithLocation: true,

    meta: {
      fields: ["id", "firstname", "lastname", "birth_date"]
    },

    onSearch: (values: any) => {
      return [
        {
          field: "lastname",
          operator: "contains",
          value: values.lastname
        }
      ];
    }
  });

  return (
    <List>
      <Form
        {...searchFormProps}
        layout="inline"
        style={{ marginBottom: "8px" }}
      >
        <Form.Item name="lastname" style={{ width: "300px" }}>
          <Search placeholder={t("patients.search.placeholder")} allowClear />
        </Form.Item>
      </Form>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="firstname"
          title={t("patients.fields.firstname")}
        />
        <Table.Column
          dataIndex="lastname"
          title={t("patients.fields.lastname")}
        />

        <Table.Column
          dataIndex="birth_date"
          title={t("patients.fields.birthDate")}
          render={(value) => <DateField value={value} locales="fr" />}
        />

        <Table.Column
          title={t("table.actions")}
          dataIndex="actions"
          render={(_, record: BaseRecord) => {
            return (
              <Space>
                <EditButton hideText size="small" recordItemId={record.id} />
                <ShowButton hideText size="small" recordItemId={record.id} />
                <DeleteButton hideText size="small" recordItemId={record.id} />
              </Space>
            );
          }}
        />
      </Table>
    </List>
  );
};

export default PatientList;
