import { useQuery } from 'react-query';
import { startCase } from 'lodash';

const getData = async () => {
  const [
    protcolsList,
    treasuries,
    fees,
    volume,
    users,
    raises,
    governance,
    expenses,
    emissions,
    yields,
  ] = await Promise.all([
    fetch('https://api.llama.fi/lite/protocols2').then((r) =>
      r.json()
    ),
    fetch('https://api.llama.fi/treasuries').then((r) => r.json()),
    fetch('https://api.llama.fi/overview/fees').then((r) => r.json()),
    fetch('https://api.llama.fi/overview/dexs').then((r) => r.json()),
    fetch('https://api.llama.fi/activeUsers').then((r) => r.json()),
    fetch('https://api.llama.fi/raises').then((r) => r.json()),
    fetch(
      'https://defillama-datasets.llama.fi/governance-cache/overview/snapshot.json'
    ).then((r) => r.json()),
    fetch(
      'https://raw.githubusercontent.com/DefiLlama/defillama-server/master/defi/src/operationalCosts/output/expenses.json'
    ).then((r) => r.json()),
    fetch(
      'https://defillama-datasets.llama.fi/emissionsProtocolsList'
    ).then((r) => r.json()),
    fetch('https://yields.llama.fi/pools').then((r) => r.json()),
  ]);

  const normalizedFees = Object.fromEntries(
    fees?.protocols?.map((fee) => [fee.defillamaId, fee])
  );
  const normalizedTreasuries = Object.fromEntries(
    treasuries?.map((treasury) => [
      treasury?.id?.replace('-treasury', ''),
      treasury,
    ])
  );

  const normalizedYields = Object.fromEntries(
    yields?.data.map((y) => [startCase(y.project), y])
  );

  console.log(governance, protcolsList);

  const normalizedVolume = Object.fromEntries(
    volume?.protocols?.map((protocol) => [
      protocol?.defillamaId,
      protocol,
    ])
  );

  const normalizedRaises = Object.fromEntries(
    raises?.raises
      .filter((raise) => raise?.defillamaId !== undefined)
      .map((r) => [r?.defillamaId, r])
  );

  const normalizedExpenses = Object.fromEntries(
    expenses?.map((expense) => [expense.protocolId, expense])
  );

  const normalizedEmissions = Object.fromEntries(
    emissions?.map((emission) => [startCase(emission), true])
  );

  const finalProtocolsData = protcolsList?.protocols?.map(
    (protocol) => {
      const id = protocol?.defillamaId;
      return {
        ...protocol,
        volume: !!normalizedVolume[id],
        fees: !!normalizedFees[id],
        treasuries: !!normalizedTreasuries[id],
        raises: !!normalizedRaises[id],
        expenses:
          !!normalizedExpenses[id] ||
          !!normalizedExpenses[protocol?.parentProtocol],
        emissions: !!normalizedEmissions[protocol?.name],
        yields: !!normalizedYields[protocol?.name],
        users: !!users[id],
        governance:
          !!governance[
            protocol?.governanceID?.[0]?.replace('snapshot:', '')
          ],
      };
    }
  );
  return finalProtocolsData;
};

const useProtocolsData = () => {
  const res = useQuery(['prtocols'], () => getData());
  return res;
};

export { useProtocolsData };
