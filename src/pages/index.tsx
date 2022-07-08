import axios from 'axios';
import { useState } from 'react';
import { Col, Row, Table } from 'antd';
import { Button, Form, Input } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import { parseISO, format } from 'date-fns';

import { pt } from 'date-fns/locale';
import { ExportCSV } from '@/components/ExportCSV';

export default function Home() {
  const [results, setResults] = useState([]);
  const [linkCode, setLinkCode] = useState(``);
  const [shareLink, setShareLink] = useState(``);

  function handleSubmit(values: any) {
    axios
      .get(`/api/learning`, {
        params: {
          phpsessid: values.phpsessid,
          code: values.code,
        },
      })
      .then(function (response) {
        const { data } = response;

        const mapper = data.results.map((data: any) => {
          return {
            key: uuidv4(),
            nome: data.Username,
            codigo_do_app: data.App,
            tempo: `${data.Time} segundos`,
            feito_em: format(
              parseISO(data.Created),
              `'Dia' dd 'de' MMMM', às ' HH:mm'h'`,
              { locale: pt },
            ),
          };
        });

        console.log(mapper);
        setResults(mapper);
        setLinkCode(`https://learningapps.org/watch?v=${values.code}`);
        setShareLink(`https://learningapps.org/display?v=${values.code}`);
      });
  }

  const onFinishFailed = (errorInfo: any) => {
    console.log(`Failed:`, errorInfo);
  };

  const columns = [
    {
      title: `Nome`,
      dataIndex: `nome`,
      key: `nome`,
    },
    {
      title: `Código do app`,
      dataIndex: `codigo_do_app`,
      key: `codigo_do_app`,
    },
    {
      title: `Tempo para execução`,
      dataIndex: `tempo`,
      key: `tempo`,
    },
    {
      title: `Data de execução`,
      dataIndex: `feito_em`,
      key: `feito_em`,
    },
  ];

  return (
    <>
      <Row>
        <Col span={12} offset={6}>
          <div
            style={{
              display: `flex`,
              justifyContent: `center`,
              marginTop: 30,
              marginBottom: 50,
            }}
          >
            <img src="http://asa.my1.ru/interakt_1.jpg" alt="" />
          </div>

          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="PHPSESSID"
              name="phpsessid"
              rules={[{ required: true, message: `Insira um PHPSESSID!` }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Código do jogo"
              name="code"
              rules={[{ required: true, message: `Insira o código do game!` }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <div style={{ display: `flex`, justifyContent: `end` }}>
                <Button type="primary" htmlType="submit">
                  Buscar
                </Button>
              </div>
            </Form.Item>
          </Form>

          {linkCode && (
            <div
              style={{
                display: `flex`,
                justifyContent: `center`,
                flexDirection: `column`,
              }}
            >
              <span>Link do game é: {` `}</span>
              <a href={linkCode} target="_blank" rel="noreferrer">
                {linkCode}
              </a>
              <br />
              <span>Link para compartilhar o game é: {` `}</span>
              <a href={shareLink} target="_blank" rel="noreferrer">
                {shareLink}
              </a>
            </div>
          )}

          <br />
          <br />
          <Table dataSource={results} columns={columns} />
          <br />
          {results.length > 0 && (
            <div style={{ display: `flex`, justifyContent: `end` }}>
              <ExportCSV csvData={results} fileName="Documento" />
            </div>
          )}
        </Col>
      </Row>
    </>
  );
}
