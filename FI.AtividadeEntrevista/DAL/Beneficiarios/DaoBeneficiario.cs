using FI.AtividadeEntrevista.DML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.DAL
{
    internal class DaoBeneficiario : AcessoDados
    {
        internal void Incluir(DML.Beneficiario beneficiario)
        {
            var parametros = new List<SqlParameter>();

            parametros.Add(new SqlParameter("IdCliente", beneficiario.IdCliente));
            parametros.Add(new SqlParameter("Nome", beneficiario.Nome));
            parametros.Add(new SqlParameter("CPF", beneficiario.CPF));

            base.Executar("FI_SP_IncBeneficiario", parametros);
        }

        internal bool VerificarExistencia(string CPF, long IdCliente, long id)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("@CPF", CPF));
            parametros.Add(new System.Data.SqlClient.SqlParameter("@IDCLIENTE", IdCliente));
            parametros.Add(new System.Data.SqlClient.SqlParameter("@ID", id));

            DataSet ds = base.Consultar("FI_SP_VerificaBeneficiario", parametros);

            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                int existe = Convert.ToInt32(ds.Tables[0].Rows[0]["Existe"]);
                return existe > 0;
            }

            return false;
        }
        
        internal void Alterar(DML.Beneficiario beneficiario)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("IDCLIENTE", beneficiario.IdCliente));
            parametros.Add(new System.Data.SqlClient.SqlParameter("NOME", beneficiario.Nome));            
            parametros.Add(new System.Data.SqlClient.SqlParameter("CPF", beneficiario.CPF));
            parametros.Add(new System.Data.SqlClient.SqlParameter("ID", beneficiario.Id));

            base.Executar("FI_SP_AltBeneficiario", parametros);
        }

        internal List<Beneficiario> ListarPorCliente(long idCliente)
        {
            List<SqlParameter> parametros = new List<SqlParameter>();
            parametros.Add(new SqlParameter("IdCliente", idCliente));

            DataSet ds = base.Consultar("FI_SP_ConsBeneficiario", parametros);

            List<Beneficiario> lista = new List<Beneficiario>();

            if (ds.Tables.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    lista.Add(new Beneficiario()
                    {
                        Id = Convert.ToInt64(row["Id"]),
                        Nome = row["Nome"].ToString(),
                        CPF = row["CPF"].ToString(),
                        IdCliente = Convert.ToInt64(row["IdCliente"])
                    });
                }
            }

            return lista;
        }

        internal void Excluir(long id)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("Id", id));

            base.Executar("FI_SP_DelBeneficiario", parametros);
        }
    }
}
