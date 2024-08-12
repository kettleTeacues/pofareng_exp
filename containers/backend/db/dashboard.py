from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List

from . import engine
from models.dashboard import Dashboard

# Dashboards
def selectDashboards():
    with Session(engine) as session:
        stmt = select(Dashboard).order_by(Dashboard.order)

        res = session.execute(stmt).all()
        return [row[0].to_dict() for row in res]

def createDashboard(req: List[Dashboard.Post_Request]):
    with Session(engine) as session:
        postDashboards = []
        for params in req:
            postDashboards.append(Dashboard(
                title = params.title,
                description = params.description,
                tiles = params.tiles,
                created_by_id = params.user_id,
            ))

        session.add_all(postDashboards)
        session.commit()
        for rec in postDashboards:
            session.refresh(rec)
        return [rec.to_dict() for rec in postDashboards]
    
def updateDashboard(req: List[Dashboard.Put_Request]):
    with Session(engine) as session:
        param_record_ids = [params.id for params in req]
        existing_dashboards = session.query(Dashboard).filter(Dashboard.id.in_(param_record_ids)).all()
        
        for dashboard in existing_dashboards:
            for params in req:
                if dashboard.id == params.id:
                    if params.order is not None:
                        dashboard.order = params.order
                    if params.title is not None:
                        dashboard.title = params.title
                    if params.description is not None:
                        dashboard.description = params.description
                    if params.tiles is not None:
                        dashboard.tiles = params.tiles
                    if params.datasets is not None:
                        dashboard.datasets = params.datasets
        session.commit()
        return [dashboard.to_dict() for dashboard in existing_dashboards]

def deleteDashboard(req: List[str]):
    with Session(engine) as session:
        param_record_ids = req
        existing_dashboards = session.query(Dashboard).filter(Dashboard.id.in_(param_record_ids)).all()
        
        for dashboard in existing_dashboards:
            session.delete(dashboard)
        session.commit()
        return [dashboard.to_dict() for dashboard in existing_dashboards]
