"use client";

import { useShow } from "@refinedev/core";
import { DateField, Show, ShowButton, TextField } from "@refinedev/antd";
import { Card, Table, Tag, Tooltip, Typography } from "antd";
import { IViewPatient } from "src/types";
import { useTranslation } from "react-i18next";
import { getTagColor } from "@utils/examinations";
import { useRouter } from "next/navigation";
import { calculateAge } from "@utils/patient";

const { Title } = Typography;

const PatientShow: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { queryResult } = useShow({
    meta: {
      fields: [
        "id",
        "firstname",
        "lastname",
        "birth_date",
        "examinations {id, examination_type, examination_date, description, files, report, state}"
      ]
    }
  });
  const { data, isLoading } = queryResult;
  const record = data?.data as IViewPatient;

  return (
    <>
      <Show
        isLoading={isLoading}
        title={`${record?.firstname} ${record?.lastname}`}
        contentProps={{ hidden: true }}
      />

      <div className="mt-4 w-full">
        <div className="w-full mb-3 md:mb-0">
          <Card bordered={false}>
            <div className="flex justify-between *:w-1/2 mb-3">
              <div>
                <Title level={5}>{t("patients.fields.firstname")}</Title>
                <TextField value={record?.firstname} />
              </div>
              <div>
                <Title level={5}>{t("patients.fields.lastname")}</Title>
                <TextField value={record?.lastname} />
              </div>
            </div>
            <div className="flex justify-between *:w-1/2 mb-3">
              <div>
                <Title level={5}>{t("patients.fields.birthDate")}</Title>
                <DateField value={record?.birth_date} locales="fr" />
              </div>

              <div>
                <Title level={5}>{t("patients.fields.age")}</Title>
                <p>{calculateAge(record?.birth_date ?? Date.now())}</p>
              </div>
            </div>
          </Card>

          <div className="my-3" />
        </div>

        <Card bordered={false}>
          <Title level={4}>{t("patients.create.examTitle")}</Title>
          <Table dataSource={record?.examinations} rowKey="id">
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
            />

            <Table.Column
              title={t("table.actions")}
              dataIndex="actions"
              render={() => {
                return (
                  <ShowButton
                    onClick={() =>
                      router.push(
                        `/examinations/show/${record.examinations[0].id}`
                      )
                    }
                  />
                );
              }}
            />
          </Table>
        </Card>
      </div>
    </>
  );
};

export default PatientShow;
