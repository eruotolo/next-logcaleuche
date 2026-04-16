import { Calendar, Shield, Users } from 'lucide-react';



import { getPublicStats } from '@/features/auth/actions';



















function formatFechaTenida(fecha: Date): string {
    const dia = fecha.getUTCDate();
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${dia} ${meses[fecha.getUTCMonth()]}`;
}

export async function BrandStats() {
    const { hermanosActivos, proximaTenida } = await getPublicStats();

    return (
        <div className="ag-stats-row">
            <div className="ag-stat-card flex flex-col items-center justify-center">
                <div className="ag-stat-icon ag-stat-icon--primary">
                    <Users size={16} />
                </div>
                <div className="ag-stat-value">{hermanosActivos}</div>
                <div className="ag-stat-label">Hermanos Activos</div>
            </div>
            <div className="ag-stat-card flex flex-col items-center justify-center">
                <div className="ag-stat-icon ag-stat-icon--secondary">
                    <Shield size={16} />
                </div>
                <div className="ag-stat-value">3 Años</div>
                <div className="ag-stat-label">de Legado</div>
            </div>
            <div className="ag-stat-card flex flex-col items-center justify-center">
                <div className="ag-stat-icon ag-stat-icon--tertiary">
                    <Calendar size={16} />
                </div>
                <div className="ag-stat-value">
                    {proximaTenida?.fecha ? formatFechaTenida(proximaTenida.fecha) : '—'}
                </div>
                <div className="ag-stat-label">
                    {proximaTenida ? 'Próxima Tenida' : 'Sin Tenidas'}
                </div>
            </div>
        </div>
    );
}
