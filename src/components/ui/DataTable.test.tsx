import { render, screen } from '@testing-library/react';
import { DataTable, type DataTableColumn } from './DataTable';
import { Toolbar } from './Toolbar';

interface Row {
  id: string;
  name: string;
}

const columns: DataTableColumn<Row>[] = [{ key: 'name', header: 'Nome', render: (r) => r.name }];

describe('DataTable', () => {
  it('renderiza cabecalho e linhas', () => {
    render(
      <DataTable
        columns={columns}
        rows={[
          { id: '1', name: 'Praca' },
          { id: '2', name: 'Museu' },
        ]}
        getRowId={(r) => r.id}
        emptyMessage="Nada aqui"
      />,
    );

    expect(screen.getByRole('columnheader', { name: 'Nome' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Praca' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Museu' })).toBeInTheDocument();
    expect(screen.queryByText('Nada aqui')).toBeNull();
  });

  it('mostra a mensagem de vazio sem linhas', () => {
    render(
      <DataTable columns={columns} rows={[]} getRowId={(r) => r.id} emptyMessage="Nada aqui" />,
    );

    expect(screen.getByText('Nada aqui')).toBeInTheDocument();
  });
});

describe('Toolbar', () => {
  it('renderiza os filhos', () => {
    render(
      <Toolbar>
        <input aria-label="Buscar" />
      </Toolbar>,
    );

    expect(screen.getByRole('textbox', { name: 'Buscar' })).toBeInTheDocument();
  });
});
