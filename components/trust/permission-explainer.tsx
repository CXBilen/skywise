'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Calendar,
  Shield,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  AlertCircle,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motionVariants, colors } from '@/lib/design-tokens';

// ============================================
// Types
// ============================================

type PermissionType = 'email' | 'calendar';

interface PermissionExplainerProps {
  permissionType: PermissionType;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  provider?: string;
  lastSynced?: Date;
}

// ============================================
// Permission Data
// ============================================

const PERMISSION_DATA: Record<PermissionType, {
  icon: React.ElementType;
  title: string;
  description: string;
  canDo: string[];
  cannotDo: string[];
  dataAccess: string[];
  trustMessage: string;
  color: string;
  bgColor: string;
}> = {
  email: {
    icon: Mail,
    title: 'Email Access',
    description: 'Import flight confirmations from your inbox automatically.',
    canDo: [
      'Read flight confirmation emails',
      'Extract booking details (dates, flights, confirmations)',
      'Import trips to your dashboard',
    ],
    cannotDo: [
      'Send emails on your behalf',
      'Delete or modify your emails',
      'Access non-travel emails',
      'Share your email data with third parties',
    ],
    dataAccess: [
      'Subject lines containing travel keywords',
      'Email body for flight details extraction',
      'Sender addresses from known airlines',
    ],
    trustMessage: 'Read-only access. We will never send, delete, or modify your emails.',
    color: colors.primary[600],
    bgColor: colors.primary[50],
  },
  calendar: {
    icon: Calendar,
    title: 'Calendar Access',
    description: 'Check your schedule to find flights that fit perfectly.',
    canDo: [
      'View your calendar events',
      'Check for scheduling conflicts',
      'Add confirmed flights to your calendar',
    ],
    cannotDo: [
      'Delete existing events',
      'Modify your existing events',
      'View event details beyond time/title',
      'Access calendars you haven\'t authorized',
    ],
    dataAccess: [
      'Event start and end times',
      'Event titles (to identify conflicts)',
      'All-day event status',
    ],
    trustMessage: 'Events are only added with your explicit confirmation.',
    color: colors.success.main,
    bgColor: colors.success.light,
  },
};

// ============================================
// Permission Explainer Component
// ============================================

export function PermissionExplainer({
  permissionType,
  isConnected,
  onConnect,
  onDisconnect,
  provider,
  lastSynced,
}: PermissionExplainerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirmDisconnect, setShowConfirmDisconnect] = useState(false);

  const data = PERMISSION_DATA[permissionType];
  const Icon = data.icon;

  return (
    <Card className="overflow-hidden border border-slate-200/60 bg-white/80 backdrop-blur-sm">
      {/* Header */}
      <div
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ backgroundColor: isConnected ? data.bgColor : undefined }}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: isConnected ? `${data.color}20` : colors.neutral[100],
            }}
          >
            <Icon
              className="w-5 h-5"
              style={{ color: isConnected ? data.color : colors.neutral[400] }}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900">{data.title}</h3>
              <Badge
                variant={isConnected ? 'default' : 'secondary'}
                className="text-xs"
              >
                {isConnected ? 'Connected' : 'Not Connected'}
              </Badge>
            </div>
            <p className="text-sm text-slate-600 mt-0.5">{data.description}</p>

            {isConnected && (
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                {provider && (
                  <span className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-500" />
                    {provider}
                  </span>
                )}
                {lastSynced && (
                  <span className="flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    Last synced {formatRelativeTime(lastSynced)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Expand button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Trust message */}
        <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: data.color }}>
          <Shield className="w-3 h-3" />
          {data.trustMessage}
        </div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 space-y-4 border-t border-slate-100 pt-4">
              {/* What we can do */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  What we can do
                </h4>
                <ul className="space-y-1.5 pl-6">
                  {data.canDo.map((item, index) => (
                    <li
                      key={index}
                      className="text-sm text-slate-600 flex items-start gap-2"
                    >
                      <span className="text-emerald-500 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What we cannot do */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
                  <X className="w-4 h-4 text-red-500" />
                  What we cannot do
                </h4>
                <ul className="space-y-1.5 pl-6">
                  {data.cannotDo.map((item, index) => (
                    <li
                      key={index}
                      className="text-sm text-slate-600 flex items-start gap-2"
                    >
                      <span className="text-red-500 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Data we access */}
              <div>
                <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-slate-500" />
                  Data we access
                </h4>
                <ul className="space-y-1.5 pl-6">
                  {data.dataAccess.map((item, index) => (
                    <li
                      key={index}
                      className="text-sm text-slate-600 flex items-start gap-2"
                    >
                      <span className="text-slate-400 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-100">
                {!isConnected ? (
                  <Button
                    onClick={onConnect}
                    className="w-full"
                    style={{ backgroundColor: data.color }}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Connect {data.title}
                  </Button>
                ) : showConfirmDisconnect ? (
                  <div className="space-y-2">
                    <p className="text-sm text-amber-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Are you sure? This will stop automatic imports.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowConfirmDisconnect(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => {
                          onDisconnect();
                          setShowConfirmDisconnect(false);
                        }}
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowConfirmDisconnect(true)}
                    >
                      <EyeOff className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                    <a
                      href="/settings"
                      className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
                    >
                      Manage in Settings
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ============================================
// Data Usage Indicator
// ============================================

interface DataUsageIndicatorProps {
  dataType: 'email' | 'calendar' | 'flights';
  status: 'reading' | 'writing' | 'idle';
  lastAccessed?: Date;
  compact?: boolean;
}

export function DataUsageIndicator({
  dataType,
  status,
  lastAccessed,
  compact = false,
}: DataUsageIndicatorProps) {
  const [showDetails, setShowDetails] = useState(false);

  const icons: Record<string, React.ElementType> = {
    email: Mail,
    calendar: Calendar,
    flights: Shield,
  };

  const statusColors: Record<string, string> = {
    reading: 'bg-sky-500',
    writing: 'bg-amber-500',
    idle: 'bg-slate-300',
  };

  const statusLabels: Record<string, string> = {
    reading: 'Reading data...',
    writing: 'Writing data...',
    idle: 'Idle',
  };

  const Icon = icons[dataType] || Shield;

  if (compact) {
    return (
      <div className="relative inline-flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
        <Icon className="w-3 h-3 text-slate-400" />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <div className="relative">
          <Icon className="w-4 h-4 text-slate-500" />
          <div
            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${statusColors[status]} border-2 border-white`}
          />
        </div>
        <span className="text-xs text-slate-500 capitalize">{dataType}</span>
      </button>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            {...motionVariants.fadeInDown}
            className="absolute top-full right-0 mt-1 w-48 p-3 bg-white rounded-lg shadow-lg border border-slate-200 z-10"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700 capitalize">
                  {dataType} Access
                </span>
                <Badge variant="secondary" className="text-xs">
                  {statusLabels[status]}
                </Badge>
              </div>

              {lastAccessed && (
                <p className="text-xs text-slate-500">
                  Last accessed: {formatRelativeTime(lastAccessed)}
                </p>
              )}

              <a
                href="/settings#privacy"
                className="text-xs text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                <Info className="w-3 h-3" />
                View privacy details
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// Privacy Notice Banner
// ============================================

interface PrivacyNoticeBannerProps {
  action: string;
  onLearnMore?: () => void;
}

export function PrivacyNoticeBanner({ action, onLearnMore }: PrivacyNoticeBannerProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
      <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
      <p className="text-xs text-slate-600 flex-1">
        {action}
      </p>
      {onLearnMore && (
        <button
          onClick={onLearnMore}
          className="text-xs text-sky-600 hover:text-sky-700 whitespace-nowrap"
        >
          Learn more
        </button>
      )}
    </div>
  );
}

// ============================================
// Confirmation Checkbox
// ============================================

interface ConfirmationCheckboxProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ConfirmationCheckbox({
  id,
  label,
  description,
  checked,
  onChange,
}: ConfirmationCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors"
    >
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
            checked
              ? 'bg-sky-500 border-sky-500'
              : 'bg-white border-slate-300'
          }`}
        >
          {checked && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
}

// ============================================
// Helpers
// ============================================

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

export default PermissionExplainer;
