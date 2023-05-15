import { useProtocolsData } from './hooks';
import { Table, Layout, Typography } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { capitalize } from 'lodash';

const { Header, Content } = Layout;
const { Title } = Typography;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'TVL',
    dataIndex: 'tvl',
    key: 'tvl',
    sorter: (a, b) => a.tvl - b.tvl,
  },
  ...[
    'volume',
    'fees',
    'treasuries',
    'raises',
    'expenses',
    'emissions',
  ].map((key) => ({
    title: capitalize(key),
    dataIndex: key,
    key: key,
    filters: [
      { text: 'True', value: true },
      { text: 'False', value: false },
    ],
    onFilter: (value, record) => record.volume === value,
    render: (key) =>
      key ? (
        <CheckOutlined style={{ color: 'green' }} />
      ) : (
        <CloseOutlined style={{ color: 'red' }} />
      ),
  })),
];

function App() {
  const data = useProtocolsData();

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <Header
        style={{
          backgroundColor: '#F0F2F5',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Title level={2} style={{ color: '#333' }}>
          Tracked protocols metrics
        </Title>
      </Header>
      <Content
        style={{
          padding: '0 50px',
          overflowY: 'auto',
          marginTop: '16px',
        }}
      >
        <div style={{ background: '#fff', padding: 24 }}>
          <Table
            columns={columns}
            dataSource={data?.data || []}
            pagination={{ pageSize: 50, position: ['bottomCenter'] }}
            scroll={{ y: 'calc(100vh - 64px - 180px)' }}
          />
        </div>
      </Content>
    </Layout>
  );
}

export default App;
