import { useProtocolsData } from './hooks';
import { Table, Layout, Typography } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { capitalize } from 'lodash';

const { Header, Content } = Layout;
const { Title } = Typography;

const withVolume = ['Dexes', 'NFT Marketplace', 'Derivatives'];

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
    render: (val) => (
      <span>
        {Intl.NumberFormat('en-US', {
          notation: 'compact',
          maximumFractionDigits: 2,
        }).format(val)}
      </span>
    ),
  },
  ...[
    'volume',
    'fees',
    'treasuries',
    'raises',
    'expenses',
    'emissions',
    'users',
    'yields',
    'governance',
  ].map((key) => ({
    title: capitalize(key),
    dataIndex: key,
    key: key,
    filters: [
      { text: 'True', value: true },
      { text: 'False', value: false },
    ],
    onFilter: (value, record) => record.volume === value,
    render: (k, record) => {
      return key === 'volume' &&
        !withVolume.includes(record.category) ? null : k ? (
        <CheckOutlined style={{ color: 'green' }} />
      ) : (
        <CloseOutlined style={{ color: 'red' }} />
      );
    },
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
