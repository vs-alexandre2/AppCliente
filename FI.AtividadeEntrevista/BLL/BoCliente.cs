using FI.AtividadeEntrevista.DML;
using FI.AtividadeEntrevista.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoCliente
    {
        /// <summary>
        /// Inclui um novo cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        public long Incluir(DML.Cliente cliente)
        {            
            cliente.CPF = cliente.CPF?.Replace(".", "").Replace("-", "");

            if (!ValidadorCpf.Validar(cliente.CPF))
                throw new Exception("CPF inválido");

            if (VerificarExistencia(cliente.CPF, cliente.Id))
                throw new Exception("CPF já cadastrado");
            
            if (cliente.Beneficiarios != null)
            {
                var daoBenef = new DAL.DaoBeneficiario();

                foreach (var beneficiario in cliente.Beneficiarios)
                {
                    beneficiario.CPF = beneficiario.CPF?.Replace(".", "").Replace("-", "");
                    if (!ValidadorCpf.Validar(beneficiario.CPF))
                        throw new Exception($"CPF inválido para beneficiário {beneficiario.Nome}");

                    if (daoBenef.VerificarExistencia(cliente.CPF, beneficiario.IdCliente, cliente.Id))
                        throw new Exception($"O CPF do beneficiário {beneficiario.Nome} já está cadastrado para esse cliente");
                }
            }
            
            var daoCliente = new DAL.DaoCliente();
            long idCliente = daoCliente.Incluir(cliente);
            
            if (cliente.Beneficiarios != null)
            {
                var daoBenef = new DAL.DaoBeneficiario();
                foreach (var b in cliente.Beneficiarios)
                {
                    b.IdCliente = idCliente;
                    daoBenef.Incluir(b);
                }
            }

            return idCliente;
        }

        /// <summary>
        /// Altera um cliente
        /// </summary>
        /// <param name="cliente">Objeto de cliente</param>
        public void Alterar(DML.Cliente cliente)
        {
            cliente.CPF = cliente.CPF?.Replace(".", "").Replace("-", "");

            if (!ValidadorCpf.Validar(cliente.CPF))
                throw new Exception("CPF inválido");

            if (VerificarExistencia(cliente.CPF, cliente.Id))
                throw new Exception("CPF já cadastrado");

            DAL.DaoCliente cli = new DAL.DaoCliente();
            cli.Alterar(cliente);

            var daoBenef = new DAL.DaoBeneficiario();
            
            var beneficiariosAtuais = daoBenef.ListarPorCliente(cliente.Id);

            foreach (var bAtual in beneficiariosAtuais)
            {
                if (cliente.Beneficiarios == null ||
                    !cliente.Beneficiarios.Any(b => b.Id == bAtual.Id))
                {
                    daoBenef.Excluir(bAtual.Id);
                }
            }
            
            if (cliente.Beneficiarios != null && cliente.Beneficiarios.Any())
            {
                foreach (var beneficiario in cliente.Beneficiarios)
                {
                    beneficiario.CPF = beneficiario.CPF?.Replace(".", "").Replace("-", "");

                    if (!ValidadorCpf.Validar(beneficiario.CPF))
                        throw new Exception($"CPF inválido para beneficiário {beneficiario.Nome}");

                    beneficiario.IdCliente = cliente.Id;
          
                    if (daoBenef.VerificarExistencia(beneficiario.CPF, cliente.Id, beneficiario.Id))
                        throw new Exception($"O CPF do beneficiário {beneficiario.Nome} já está cadastrado para esse cliente");

                    if (beneficiario.Id == 0)
                    {                        
                        daoBenef.Incluir(beneficiario);
                    }
                    else
                    {                        
                        daoBenef.Alterar(beneficiario);
                    }
                }
            }
        }

        /// <summary>
        /// Consulta o cliente pelo id
        /// </summary>
        /// <param name="id">id do cliente</param>
        /// <returns></returns>
        public Cliente Consultar(long id)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            var cliente = cli.Consultar(id);

            if (cliente != null)
            {
                var daoBenef = new DAL.DaoBeneficiario();
                cliente.Beneficiarios = daoBenef.ListarPorCliente(id);
            }

            return cliente;
        }

        /// <summary>
        /// Excluir o cliente pelo id
        /// </summary>
        /// <param name="id">id do cliente</param>
        /// <returns></returns>
        public void Excluir(long id)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            cli.Excluir(id);
        }

        /// <summary>
        /// Lista os clientes
        /// </summary>
        public List<DML.Cliente> Listar()
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.Listar();
        }

        /// <summary>
        /// Lista os clientes
        /// </summary>
        public List<DML.Cliente> Pesquisa(int iniciarEm, int quantidade, string campoOrdenacao, bool crescente, out int qtd)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.Pesquisa(iniciarEm,  quantidade, campoOrdenacao, crescente, out qtd);
        }

        /// <summary>
        /// VerificaExistencia
        /// </summary>
        /// <param name="CPF"></param>
        /// <returns></returns>
        public bool VerificarExistencia(string CPF, long id)
        {
            DAL.DaoCliente cli = new DAL.DaoCliente();
            return cli.VerificarExistencia(CPF, id);
        }
    }
}
