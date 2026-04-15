import styled from 'styled-components';
import { FormItem } from '@/components/admin/controls/AdminForm';

export const FormStack = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ToggleFormItem = styled(FormItem)`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const SectionStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SectionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const SectionTitle = styled.h5`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
`;

export const ItemCard = styled.div`
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #f8fafc;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FooterRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const ErrorText = styled.p`
  margin: 0;
  color: #b91c1c;
  font-size: 0.875rem;
`;

export const SelectInput = styled.select`
  height: 36px;
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  padding: 0 10px;
  color: #0f172a;
  font-size: 0.875rem;
  outline: none;

  &:focus-visible {
    border-color: #334155;
    box-shadow: 0 0 0 3px rgba(51, 65, 85, 0.16);
  }
`;

export const BorderedPanel = styled.div`
  padding: 16px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
