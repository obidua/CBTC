import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { CONTRACT_ADDRESSES } from '../lib/constants';

export function ContractStatus() {
  const isICOConfigured = CONTRACT_ADDRESSES.CBTC_ICO !== '0x0000000000000000000000000000000000000000';
  const isTokenConfigured = CONTRACT_ADDRESSES.CBTC_TOKEN !== '0x0000000000000000000000000000000000000000';

  const allConfigured = isICOConfigured && isTokenConfigured;

  if (allConfigured) {
    return null;
  }

  return (
    <div className="bg-orange-500/10 border border-orange-500/50 rounded-xl p-4 mb-6">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-orange-400 font-medium mb-2">Smart Contracts Not Configured</p>
          <p className="text-orange-300/80 text-sm mb-3">
            The application is not connected to deployed smart contracts. Real blockchain data will not be available until contracts are deployed and configured.
          </p>

          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              {isICOConfigured ? (
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-orange-400" />
              )}
              <span className={isICOConfigured ? 'text-green-400' : 'text-orange-300'}>
                ICO Contract: {isICOConfigured ? 'Configured' : 'Not Configured'}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {isTokenConfigured ? (
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-orange-400" />
              )}
              <span className={isTokenConfigured ? 'text-green-400' : 'text-orange-300'}>
                Token Contract: {isTokenConfigured ? 'Configured' : 'Not Configured'}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-orange-500/30">
            <p className="text-orange-300/80 text-xs mb-2">
              To configure contracts:
            </p>
            <ol className="text-orange-300/80 text-xs space-y-1 list-decimal list-inside">
              <li>Deploy your smart contracts to BNB Smart Chain</li>
              <li>Update VITE_ICO_CONTRACT_ADDRESS in .env file</li>
              <li>Update VITE_CBTC_TOKEN_ADDRESS in .env file</li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
