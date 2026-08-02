import React, { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  FormControlLabel,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
  Switch,
} from '@mui/material';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import CalculateOutlined from '@mui/icons-material/CalculateOutlined';
import PaymentsOutlined from '@mui/icons-material/PaymentsOutlined';
import ReceiptLongOutlined from '@mui/icons-material/ReceiptLongOutlined';
import RestartAltRounded from '@mui/icons-material/RestartAltRounded';

type RoleKey = 'oneStar' | 'twoStar' | 'threeStar' | 'deputyHead' | 'head';

type OvertimeTier = {
  label: string;
  width: number | null;
  rate: number;
};

type RoleConfig = {
  label: string;
  shortLabel: string;
  baseHours: number;
  baseSalary: number;
  overtimeTiers: OvertimeTier[];
  hasOccupancyRate: boolean;
  occupancyThresholds?: {
    minimum: number;
    full: number;
  };
  allowanceLabel: string;
  salesRules: string[];
};

type SalaryInputs = {
  coachName: string;
  hours: number;
  sales: number;
  bigOrder: number;
  discount: number;
  conversionRate: number;
  occupancyRate: number;
  allowance: number;
  commissionSuspended: boolean;
};

type OvertimeDetail = OvertimeTier & {
  hours: number;
  amount: number;
};

type SalaryResult = {
  overtimeDetails: OvertimeDetail[];
  overtimePay: number;
  classPay: number;
  salesCommission: number;
  bigOrderCommission: number;
  commissionPool: number;
  performanceFactor: number;
  occupancyFactor: number;
  preSuspensionCommission: number;
  adjustedCommission: number;
  publicAccount: number;
  privateAccount: number;
  totalSalary: number;
  salesFormulaText: string;
};

const ROLE_ORDER: RoleKey[] = ['oneStar', 'twoStar', 'threeStar', 'deputyHead', 'head'];

const UNIFIED_SALES_RULES = [
  '未满 4 万：无销售额提成',
  '4 万–不足 6 万：销售额 × 2%',
  '6 万–不足 8 万：销售额 × 3%',
  '8 万–不足 10 万：销售额 × 4%',
  '10 万及以上：销售额 × 5%',
];

const ROLE_CONFIGS: Record<RoleKey, RoleConfig> = {
  oneStar: {
    label: '一星教练',
    shortLabel: '一星',
    baseHours: 35,
    baseSalary: 2200,
    overtimeTiers: [
      { label: '超保底 0–40 小时', width: 40, rate: 80 },
      { label: '超保底 40–80 小时', width: 40, rate: 100 },
      { label: '超保底 80–100 小时', width: 20, rate: 120 },
      { label: '超保底 100 小时以上', width: null, rate: 140 },
    ],
    hasOccupancyRate: true,
    occupancyThresholds: { minimum: 2, full: 2.15 },
    allowanceLabel: '油费 + 其他',
    salesRules: UNIFIED_SALES_RULES,
  },
  twoStar: {
    label: '二星教练',
    shortLabel: '二星',
    baseHours: 40,
    baseSalary: 2800,
    overtimeTiers: [
      { label: '超保底 0–40 小时', width: 40, rate: 90 },
      { label: '超保底 40–80 小时', width: 40, rate: 110 },
      { label: '超保底 80–100 小时', width: 20, rate: 130 },
      { label: '超保底 100 小时以上', width: null, rate: 160 },
    ],
    hasOccupancyRate: true,
    occupancyThresholds: { minimum: 2.15, full: 2.3 },
    allowanceLabel: '油费 + 其他',
    salesRules: UNIFIED_SALES_RULES,
  },
  threeStar: {
    label: '三星教练',
    shortLabel: '三星',
    baseHours: 45,
    baseSalary: 5000,
    overtimeTiers: [
      { label: '超保底 0–40 小时', width: 40, rate: 120 },
      { label: '超保底 40–80 小时', width: 40, rate: 140 },
      { label: '超保底 80–100 小时', width: 20, rate: 160 },
      { label: '超保底 100 小时以上', width: null, rate: 220 },
    ],
    hasOccupancyRate: true,
    occupancyThresholds: { minimum: 2.4, full: 2.65 },
    allowanceLabel: '油费 + 其他',
    salesRules: UNIFIED_SALES_RULES,
  },
  deputyHead: {
    label: '副主教练',
    shortLabel: '副主教练',
    baseHours: 50,
    baseSalary: 6000,
    overtimeTiers: [
      { label: '超保底 0–50 小时', width: 50, rate: 130 },
      { label: '超保底 50–100 小时', width: 50, rate: 140 },
      { label: '超保底 100 小时以上', width: null, rate: 160 },
    ],
    hasOccupancyRate: false,
    allowanceLabel: '油费',
    salesRules: UNIFIED_SALES_RULES,
  },
  head: {
    label: '主教练',
    shortLabel: '主教练',
    baseHours: 50,
    baseSalary: 8000,
    overtimeTiers: [
      { label: '超保底 0–50 小时', width: 50, rate: 170 },
      { label: '超保底 50–100 小时', width: 50, rate: 180 },
      { label: '超保底 100 小时以上', width: null, rate: 200 },
    ],
    hasOccupancyRate: false,
    allowanceLabel: '油费',
    salesRules: UNIFIED_SALES_RULES,
  },
};

const createInitialInputs = (): Record<RoleKey, SalaryInputs> =>
  ROLE_ORDER.reduce((result, role) => {
    result[role] = {
      coachName: '',
      hours: ROLE_CONFIGS[role].baseHours,
      sales: 0,
      bigOrder: 0,
      discount: 0,
      conversionRate: 50,
      occupancyRate: 0,
      allowance: 0,
      commissionSuspended: false,
    };
    return result;
  }, {} as Record<RoleKey, SalaryInputs>);

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(Number.isFinite(value) ? value : 0, min), max);

const toNonNegative = (value: number) =>
  Math.max(Number.isFinite(value) ? value : 0, 0);

const calculateSalesCommission = (salesValue: number) => {
  const sales = toNonNegative(salesValue);
  if (sales < 40000) {
    return { value: 0, text: '销售额未满 40,000，基础销售提成为 0' };
  }
  if (sales < 60000) {
    return {
      value: sales * 0.02,
      text: `${sales} × 2%`,
    };
  }
  if (sales < 80000) {
    return {
      value: sales * 0.03,
      text: `${sales} × 3%`,
    };
  }
  if (sales < 100000) {
    return {
      value: sales * 0.04,
      text: `${sales} × 4%`,
    };
  }
  return { value: sales * 0.05, text: `${sales} × 5%` };
};

export const calculateSalary = (
  role: RoleKey,
  rawInputs: SalaryInputs,
): SalaryResult => {
  const config = ROLE_CONFIGS[role];
  const hours = toNonNegative(rawInputs.hours);
  let remainingHours = Math.max(hours - config.baseHours, 0);

  const overtimeDetails = config.overtimeTiers.map((tier) => {
    const tierHours = tier.width === null
      ? remainingHours
      : Math.min(remainingHours, tier.width);
    remainingHours = Math.max(remainingHours - tierHours, 0);
    return {
      ...tier,
      hours: tierHours,
      amount: tierHours * tier.rate,
    };
  });

  const overtimePay = overtimeDetails.reduce((sum, item) => sum + item.amount, 0);
  const classPay = config.baseSalary + overtimePay;
  const sales = calculateSalesCommission(rawInputs.sales);
  const bigOrderCommission = toNonNegative(rawInputs.bigOrder) * 0.05;
  const commissionPool = sales.value + bigOrderCommission - toNonNegative(rawInputs.discount);
  const conversionRate = clamp(rawInputs.conversionRate, 0, 100);
  const performanceFactor = conversionRate < 40 ? 0 : conversionRate >= 50 ? 1 : 0.5;
  const occupancyValue = toNonNegative(rawInputs.occupancyRate);
  const occupancyFactor = config.occupancyThresholds
    ? occupancyValue < config.occupancyThresholds.minimum
      ? 0
      : occupancyValue >= config.occupancyThresholds.full
        ? 1
        : 0.5
    : 1;
  const preSuspensionCommission = commissionPool * performanceFactor * occupancyFactor;
  const adjustedCommission = rawInputs.commissionSuspended ? 0 : preSuspensionCommission;
  const publicAccount = config.baseSalary;
  const privateAccount = adjustedCommission
    + classPay
    - publicAccount
    + toNonNegative(rawInputs.allowance);

  return {
    overtimeDetails,
    overtimePay,
    classPay,
    salesCommission: sales.value,
    bigOrderCommission,
    commissionPool,
    performanceFactor,
    occupancyFactor,
    preSuspensionCommission,
    adjustedCommission,
    publicAccount,
    privateAccount,
    totalSalary: publicAccount + privateAccount,
    salesFormulaText: sales.text,
  };
};

const currency = new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'CNY',
  minimumFractionDigits: 2,
});

const formatMoney = (value: number) => currency.format(value);

const SummaryCard = ({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}) => (
  <Paper
    variant="outlined"
    sx={{
      flex: 1,
      minWidth: 0,
      p: 2,
      borderColor: '#e7e9f2',
      borderRadius: 2.5,
    }}
  >
    <Stack direction="row" alignItems="center" spacing={1} sx={{ color }}>
      {icon}
      <Typography variant="body2" color="text.secondary">{label}</Typography>
    </Stack>
    <Typography variant="h6" sx={{ mt: 1, fontWeight: 700, color }}>
      {formatMoney(value)}
    </Typography>
  </Paper>
);

const FlowCard = ({
  title,
  value,
  accent,
}: {
  title: string;
  value: string;
  accent: string;
}) => (
  <Paper
    variant="outlined"
    sx={{
      minWidth: 170,
      flex: 1,
      p: 2,
      borderRadius: 2.5,
      borderColor: '#e4e7ef',
      borderTop: `4px solid ${accent}`,
      bgcolor: '#fff',
    }}
  >
    <Typography variant="caption" color="text.secondary">{title}</Typography>
    <Typography variant="subtitle1" sx={{ mt: 0.5, fontWeight: 700 }}>{value}</Typography>
  </Paper>
);

function SalaryCalculator() {
  const [activeRole, setActiveRole] = useState<RoleKey>('oneStar');
  const [inputsByRole, setInputsByRole] = useState<Record<RoleKey, SalaryInputs>>(
    createInitialInputs,
  );

  const config = ROLE_CONFIGS[activeRole];
  const inputs = inputsByRole[activeRole];
  const result = useMemo(
    () => calculateSalary(activeRole, inputs),
    [activeRole, inputs],
  );

  const updateInput = (field: keyof SalaryInputs, value: string | number | boolean) => {
    setInputsByRole((current) => ({
      ...current,
      [activeRole]: {
        ...current[activeRole],
        [field]: field === 'coachName' || field === 'commissionSuspended'
          ? value
          : Number(value) || 0,
      },
    }));
  };

  const resetActiveRole = () => {
    const initial = createInitialInputs();
    setInputsByRole((current) => ({
      ...current,
      [activeRole]: initial[activeRole],
    }));
  };

  const performanceText = result.performanceFactor === 0
    ? '成单率低于 40%，提成系数为 0'
    : result.performanceFactor === 0.5
      ? '成单率 40%–49%，提成系数为 0.5'
      : '成单率达到 50%，提成系数为 1';

  const detailRows = [
    {
      item: '保底基本工资',
      formula: `固定底薪（含 ${config.baseHours} 小时保底课时）`,
      amount: config.baseSalary,
    },
    ...result.overtimeDetails.map((detail) => ({
      item: detail.label,
      formula: `${detail.hours.toFixed(1)} 小时 × ${formatMoney(detail.rate)}/小时`,
      amount: detail.amount,
    })),
    {
      item: '课时工资小计',
      formula: '保底基本工资 + 各档超额课时费',
      amount: result.classPay,
    },
    {
      item: '基础销售提成',
      formula: result.salesFormulaText,
      amount: result.salesCommission,
    },
    {
      item: '大单提成',
      formula: `${formatMoney(inputs.bigOrder)} × 5%`,
      amount: result.bigOrderCommission,
    },
    {
      item: '扣除优惠金额',
      formula: '基础销售提成 + 大单提成 − 优惠金额',
      amount: -toNonNegative(inputs.discount),
    },
    {
      item: '绩效后销售提成',
      formula: inputs.commissionSuspended
        ? `本月处于提成取消期，原应计 ${formatMoney(result.preSuspensionCommission)}，实际按 0 计算`
        : config.hasOccupancyRate
          ? `提成池 × ${result.performanceFactor}成单率系数 × ${result.occupancyFactor}满班率系数（输入值 ${inputs.occupancyRate}）`
          : `提成池 × ${result.performanceFactor}成单率系数`,
      amount: result.adjustedCommission,
    },
    {
      item: config.allowanceLabel,
      formula: '计入当月工资',
      amount: toNonNegative(inputs.allowance),
    },
  ];

  return (
    <Box
      sx={{
        height: '100%',
        overflowY: 'auto',
        bgcolor: '#f6f7fb',
        borderRadius: 3,
        p: { xs: 2, md: 3 },
        pb: 6,
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Box
              sx={{
                width: 42,
                height: 42,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 2.5,
                color: '#fff',
                bgcolor: '#3f51b5',
              }}
            >
              <CalculateOutlined />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>教练工资计算</Typography>
              <Typography variant="body2" color="text.secondary">
                按 2026 年提成标准与现行课时工资公式实时测算
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Chip
          label="实时计算 · 无需提交"
          color="success"
          variant="outlined"
          sx={{ fontWeight: 600, bgcolor: '#fff' }}
        />
      </Stack>

      <Paper
        variant="outlined"
        sx={{ mb: 3, borderRadius: 3, borderColor: '#e5e7ef', overflow: 'hidden' }}
      >
        <Tabs
          value={activeRole}
          onChange={(_, value: RoleKey) => setActiveRole(value)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="选择教练职级"
          sx={{
            px: 1,
            bgcolor: '#fff',
            '& .MuiTab-root': { minHeight: 64, fontWeight: 700, px: 3 },
          }}
        >
          {ROLE_ORDER.map((role) => (
            <Tab key={role} value={role} label={ROLE_CONFIGS[role].label} />
          ))}
        </Tabs>
      </Paper>

      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} lg={7}>
          <Paper
            variant="outlined"
            sx={{ height: '100%', p: { xs: 2, md: 3 }, borderRadius: 3, borderColor: '#e5e7ef' }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>工资项目录入</Typography>
                <Typography variant="body2" color="text.secondary">
                  当前职级：{config.label}，保底 {config.baseHours} 小时
                </Typography>
              </Box>
              <Button
                size="small"
                startIcon={<RestartAltRounded />}
                onClick={resetActiveRole}
              >
                重置
              </Button>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="教练姓名"
                  value={inputs.coachName}
                  onChange={(event) => updateInput('coachName', event.target.value)}
                  placeholder="选填"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="当月课时数"
                  value={inputs.hours}
                  onChange={(event) => updateInput('hours', event.target.value)}
                  inputProps={{ min: 0, step: 0.5 }}
                  InputProps={{ endAdornment: <InputAdornment position="end">小时</InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="销售额"
                  value={inputs.sales}
                  onChange={(event) => updateInput('sales', event.target.value)}
                  inputProps={{ min: 0, step: 100 }}
                  InputProps={{ startAdornment: <InputAdornment position="start">¥</InputAdornment> }}
                  helperText={activeRole === 'deputyHead' || activeRole === 'head'
                    ? '如需计入团队业绩，请在录入前合并到销售额'
                    : '按当月实际销售额填写'}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="大单金额"
                  value={inputs.bigOrder}
                  onChange={(event) => updateInput('bigOrder', event.target.value)}
                  inputProps={{ min: 0, step: 100 }}
                  InputProps={{ startAdornment: <InputAdornment position="start">¥</InputAdornment> }}
                  helperText="按金额的 5% 计算大单提成"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="优惠金额"
                  value={inputs.discount}
                  onChange={(event) => updateInput('discount', event.target.value)}
                  inputProps={{ min: 0, step: 10 }}
                  InputProps={{ startAdornment: <InputAdornment position="start">¥</InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="体验课成单率"
                  value={inputs.conversionRate}
                  onChange={(event) => updateInput('conversionRate', event.target.value)}
                  inputProps={{ min: 0, max: 100, step: 1 }}
                  InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                  helperText={performanceText}
                />
              </Grid>
              {config.hasOccupancyRate && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="满班率"
                    value={inputs.occupancyRate}
                    onChange={(event) => updateInput('occupancyRate', event.target.value)}
                    inputProps={{ min: 0, step: 0.05 }}
                    helperText={`当前换算系数：${result.occupancyFactor}（低于 ${config.occupancyThresholds?.minimum} 为 0，达到 ${config.occupancyThresholds?.full} 为 1）`}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label={config.allowanceLabel}
                  value={inputs.allowance}
                  onChange={(event) => updateInput('allowance', event.target.value)}
                  inputProps={{ min: 0, step: 10 }}
                  InputProps={{ startAdornment: <InputAdornment position="start">¥</InputAdornment> }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={(
                    <Switch
                      checked={inputs.commissionSuspended}
                      onChange={(event) => updateInput('commissionSuspended', event.target.checked)}
                      color="warning"
                    />
                  )}
                  label="本月取消提成（投诉、差评或退费处罚期）"
                />
              </Grid>
            </Grid>

            <Stack spacing={1.5} sx={{ mt: 2.5 }}>
              {config.hasOccupancyRate && (
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  每位教练每个自然月仅前 100 节私教课参与满班率计算，第 101 节起不计入满班率分子和分母。
                </Alert>
              )}
              <Alert severity="warning" sx={{ borderRadius: 2 }}>
                客诉或差评、当月有效退费超过2单、季度有效退费累计超过3单，可取消1–3个月提成。
              </Alert>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                保底基本工资仍固定支付；课时低于保底课时不会自动扣减底薪。
              </Alert>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Paper
            sx={{
              height: '100%',
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              color: '#fff',
              background: 'linear-gradient(145deg, #27368f 0%, #5368d9 100%)',
              boxShadow: '0 18px 45px rgba(45, 59, 150, 0.22)',
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.76 }}>
                  {inputs.coachName || config.label} · 预计工资总额
                </Typography>
                <Typography variant="h3" sx={{ mt: 1, fontWeight: 800, letterSpacing: -1 }}>
                  {formatMoney(result.totalSalary)}
                </Typography>
              </Box>
              <PaymentsOutlined sx={{ fontSize: 46, opacity: 0.28 }} />
            </Stack>

            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.18)' }} />

            <Stack direction={{ xs: 'column', sm: 'row', lg: 'column', xl: 'row' }} spacing={1.5}>
              <SummaryCard
                label="银行卡"
                value={result.publicAccount}
                color="#3146ad"
                icon={<AccountBalanceWalletOutlined fontSize="small" />}
              />
              <SummaryCard
                label="支付"
                value={result.privateAccount}
                color={result.privateAccount < 0 ? '#c62828' : '#18765a'}
                icon={<ReceiptLongOutlined fontSize="small" />}
              />
            </Stack>

            <Box sx={{ mt: 3 }}>
              {[
                ['课时工资', result.classPay],
                ['绩效后销售提成', result.adjustedCommission],
                [config.allowanceLabel, toNonNegative(inputs.allowance)],
              ].map(([label, value]) => (
                <Stack
                  key={label as string}
                  direction="row"
                  justifyContent="space-between"
                  sx={{ py: 0.75 }}
                >
                  <Typography variant="body2" sx={{ opacity: 0.78 }}>{label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {formatMoney(value as number)}
                  </Typography>
                </Stack>
              ))}
            </Box>

            {result.commissionPool < 0 && (
              <Alert severity="warning" sx={{ mt: 2.5 }}>
                优惠金额高于销售与大单提成，Excel 公式会产生负数提成。
              </Alert>
            )}
            {inputs.commissionSuspended && (
              <Alert severity="warning" sx={{ mt: 2.5 }}>
                本月提成已取消，课时工资和补贴仍正常计算。
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Paper
        variant="outlined"
        sx={{ mt: 3, borderRadius: 3, borderColor: '#e5e7ef', overflow: 'hidden' }}
      >
        <Box sx={{ px: 3, py: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>计算明细</Typography>
          <Typography variant="body2" color="text.secondary">
            每一项都对应工资表中的输入、分段和汇总公式
          </Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fc' }}>
                <TableCell sx={{ fontWeight: 700 }}>项目</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>计算方式</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>金额</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detailRows.map((row, index) => (
                <TableRow
                  key={`${row.item}-${index}`}
                  sx={row.item.includes('小计') ? { bgcolor: '#fafbff' } : undefined}
                >
                  <TableCell sx={{ fontWeight: row.item.includes('小计') ? 700 : 500 }}>
                    {row.item}
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{row.formula}</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 700,
                      color: row.amount < 0 ? 'error.main' : 'text.primary',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {formatMoney(row.amount)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ bgcolor: '#eef1ff' }}>
                <TableCell sx={{ fontWeight: 800 }}>工资总额</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>
                  课时工资 + 绩效后销售提成 + {config.allowanceLabel}
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: 'primary.main' }}>
                  {formatMoney(result.totalSalary)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper
        variant="outlined"
        sx={{ mt: 3, p: { xs: 2, md: 3 }, borderRadius: 3, borderColor: '#e5e7ef' }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>工资计算方式</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          当前职级的计算链路
        </Typography>

        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          alignItems="stretch"
          spacing={1.25}
          sx={{ mb: 3 }}
        >
          <FlowCard
            title="① 课时工资"
            value={`底薪 ${formatMoney(config.baseSalary)} + 分档超额课时`}
            accent="#5368d9"
          />
          <Box sx={{ display: { xs: 'none', lg: 'grid' }, placeItems: 'center' }}>
            <Typography variant="h5" color="text.secondary">+</Typography>
          </Box>
          <FlowCard
            title="② 绩效销售提成"
            value={`(销售提成 + 大单5% − 优惠) × 绩效${config.hasOccupancyRate ? ' × 满班率' : ''}`}
            accent="#00a878"
          />
          <Box sx={{ display: { xs: 'none', lg: 'grid' }, placeItems: 'center' }}>
            <Typography variant="h5" color="text.secondary">+</Typography>
          </Box>
          <FlowCard
            title={`③ ${config.allowanceLabel}`}
            value="补贴直接计入当月工资"
            accent="#f2a93b"
          />
          <Box sx={{ display: { xs: 'none', lg: 'grid' }, placeItems: 'center' }}>
            <ArrowForwardRounded color="primary" />
          </Box>
          <FlowCard
            title="工资总额"
            value={`${formatMoney(result.publicAccount)} 银行卡 + ${formatMoney(result.privateAccount)} 支付`}
            accent="#3f51b5"
          />
        </Stack>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          sx={{ mb: 3 }}
        >
          <Paper variant="outlined" sx={{ flex: 1, p: 2, borderRadius: 2.5, borderColor: '#e4e7ef' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>成单率系数</Typography>
            <Typography variant="body2" color="text.secondary">
              低于 40% → 0　｜　40%–49% → 0.5　｜　50%及以上 → 1
            </Typography>
          </Paper>
          {config.occupancyThresholds && (
            <Paper variant="outlined" sx={{ flex: 1, p: 2, borderRadius: 2.5, borderColor: '#e4e7ef' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                {config.label}满班率系数
              </Typography>
              <Typography variant="body2" color="text.secondary">
                低于 {config.occupancyThresholds.minimum} → 0　｜　
                {config.occupancyThresholds.minimum} ≤ 满班率 &lt; {config.occupancyThresholds.full} → 0.5　｜　
                {config.occupancyThresholds.full}及以上 → 1
              </Typography>
            </Paper>
          )}
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>超额课时分档</Typography>
            <Stack spacing={1}>
              {config.overtimeTiers.map((tier) => (
                <Stack
                  key={tier.label}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ p: 1.25, borderRadius: 2, bgcolor: '#f7f8fc' }}
                >
                  <Typography variant="body2">{tier.label}</Typography>
                  <Chip size="small" label={`${formatMoney(tier.rate)}/小时`} />
                </Stack>
              ))}
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>销售提成分档</Typography>
            <Stack spacing={1}>
              {config.salesRules.map((rule, index) => (
                <Stack
                  key={rule}
                  direction="row"
                  alignItems="center"
                  spacing={1.25}
                  sx={{ p: 1.25, borderRadius: 2, bgcolor: '#f7f8fc' }}
                >
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      display: 'grid',
                      placeItems: 'center',
                      flex: '0 0 auto',
                      borderRadius: '50%',
                      bgcolor: '#e7eaff',
                      color: '#3f51b5',
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography variant="body2">{rule}</Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>五类职级标准速查</Typography>
        <TableContainer sx={{ border: '1px solid #eceef5', borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8f9fc' }}>
                <TableCell sx={{ fontWeight: 700 }}>职级</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>保底课时</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>底薪</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>超额课时单价</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ROLE_ORDER.map((role) => {
                const item = ROLE_CONFIGS[role];
                return (
                  <TableRow
                    key={role}
                    hover
                    selected={role === activeRole}
                    onClick={() => setActiveRole(role)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell sx={{ fontWeight: 700 }}>{item.label}</TableCell>
                    <TableCell align="right">{item.baseHours} 小时</TableCell>
                    <TableCell align="right">{formatMoney(item.baseSalary)}</TableCell>
                    <TableCell>{item.overtimeTiers.map((tier) => tier.rate).join(' / ')} 元</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default SalaryCalculator;
